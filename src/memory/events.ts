import { type DistributionService } from "../gen/lekko/backend/v1beta1/distribution_service_connect"
import {
  ContextKey,
  type FlagEvaluationEvent,
  SendFlagEvaluationMetricsRequest,
} from "../gen/lekko/backend/v1beta1/distribution_service_pb"
import { type Value } from "../gen/lekko/client/v1beta1/configuration_service_pb"
import { type PromiseClient } from "@connectrpc/connect"
import { type ClientContext } from "../context/context"

export class EventsBatcher {
  private readonly distClient: PromiseClient<typeof DistributionService>
  private sessionKey?: string
  private batch: FlagEvaluationEvent[]
  private readonly batchSize: number
  private interval?: number | NodeJS.Timeout
  private sendPromise?: Promise<void>

  constructor(
    distClient: PromiseClient<typeof DistributionService>,
    batchSize: number,
  ) {
    this.distClient = distClient
    this.batch = []
    this.batchSize = batchSize
  }

  init(sessionKey: string): void {
    this.sessionKey = sessionKey
    this.interval = globalThis.setInterval(() => {
      this.sendBatch().catch((error) => {
        console.error("Failed to send batch:", error)
      })
    }, 5000)
  }

  async track(event: FlagEvaluationEvent): Promise<void> {
    this.batch.push(event)
    if (this.batch.length >= this.batchSize) {
      await this.sendBatch()
    }
  }

  async sendBatch(): Promise<void> {
    if (this.batch.length === 0) {
      return
    }
    if (this.sendPromise !== undefined) {
      await this.sendPromise
    }

    const events = this.batch
    this.batch = []
    this.sendPromise = this.sendMetrics(events).finally(() => {
      this.sendPromise = undefined
    })
  }

  private async sendMetrics(events: FlagEvaluationEvent[]): Promise<void> {
    try {
      await this.distClient.sendFlagEvaluationMetrics(
        new SendFlagEvaluationMetricsRequest({
          events,
          sessionKey: this.sessionKey,
        }),
      )
    } catch (e: unknown) {
      console.error(`Failed to send metrics batch: ${String(e)}`)
      this.batch.unshift(...events)
    }
  }

  async close(): Promise<void> {
    if (this.interval !== undefined) {
      clearInterval(this.interval)
    }
    if (this.sendPromise !== undefined) {
      await this.sendPromise
    }
    await this.sendBatch()
  }
}

export function toContextKeysProto(context?: ClientContext): ContextKey[] {
  if (context === undefined) {
    return []
  }
  return Object.keys(context.data).map(
    (key) =>
      new ContextKey({
        key,
        type: lekkoValueToType(context.get(key)),
      }),
  )
}

function lekkoValueToType(val: Value | undefined): string {
  if (val === undefined) {
    return ""
  }
  switch (val.kind.case) {
    case "boolValue":
      return "bool"
    case "doubleValue":
      return "float"
    case "intValue":
      return "int"
    case "stringValue":
      return "string"
  }
  return ""
}
