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
  private interval?: number
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
    this.interval = window.setInterval(() => {
      this.sendBatch()
    }, 5000)
  }

  track(event: FlagEvaluationEvent): void {
    this.batch.push(event)
    if (this.batch.length >= this.batchSize) {
      this.sendBatch()
    }
  }

  async sendBatch(): Promise<void> {
    if (this.batch.length === 0) {
      return
    }
    if (this.sendPromise) {
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
    } catch (e) {
      console.error(`Failed to send metrics batch: ${e}`)
      this.batch.unshift(...events)
    }
  }

  async close(): Promise<void> {
    if (this.interval !== undefined) {
      clearInterval(this.interval)
    }
    if (this.sendPromise) {
      await this.sendPromise
    }
    await this.sendBatch()
  }
}

export function toContextKeysProto(context?: ClientContext): ContextKey[] {
  const result: ContextKey[] = []
  if (!context) {
    return result
  }
  for (const key in context.data) {
    result.push(
      new ContextKey({
        key,
        type: lekkoValueToType(context.get(key)),
      }),
    )
  }
  return result
}

function lekkoValueToType(val: Value | undefined): string {
  if (!val) {
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
