import { DistributionService } from "../gen/lekko/backend/v1beta1/distribution_service_connect"
import { FlagEvaluationEvent } from "../gen/lekko/backend/v1beta1/distribution_service_pb"
import { RepositoryKey } from "../gen/lekko/client/v1beta1/configuration_service_pb"
import {
  type PromiseClient,
  type Transport,
  createPromiseClient,
} from "@connectrpc/connect"
import {
  type Any,
  BoolValue,
  DoubleValue,
  Int64Value,
  StringValue,
  Timestamp,
  Value,
} from "@bufbuild/protobuf"
import { ClientContext } from "../context/context"
import { type SyncClient } from "../types/client"
import { Store, type configMap, type StoredEvalResult } from "./store"
import { type ListContentsResponse } from "../gen/lekko/server/v1beta1/sdk_pb"
import { EventsBatcher, toContextKeysProto } from "./events"
import { isWellKnownPrimitive } from "../types/proto"

const eventsBatchSize = 100

// An in-memory store that fetches configs from lekko's backend.
export class Backend implements SyncClient {
  public repository: RepositoryKey
  distClient: PromiseClient<typeof DistributionService>
  public store: Store
  sessionKey?: string
  closed: boolean
  timeout?: NodeJS.Timeout
  eventsBatcher: EventsBatcher
  version: string

  constructor(
    transport: Transport,
    repositoryOwner: string,
    repositoryName: string,
    version: string,
    store?: Store,
  ) {
    this.distClient = createPromiseClient(DistributionService, transport)
    this.store = store ?? new Store(repositoryOwner, repositoryName)
    this.repository = RepositoryKey.fromJson({
      ownerName: repositoryOwner,
      repoName: repositoryName,
    })
    this.closed = false
    this.version = version
    this.eventsBatcher = new EventsBatcher(this.distClient, eventsBatchSize)
  }

  get(namespace: string, key: string, ctx?: ClientContext): unknown {
    if (this.store.registry == null) {
      throw new Error("Must initialize with registry to use get")
    }
    const result = this.store.evaluateType(namespace, key, ctx)
    const innerResult = result.evalResult.value.unpack(this.store.registry)
    if (innerResult === undefined) {
      throw new Error("type mismatch")
    }
    this.track(namespace, key, result, ctx)
    // For primitive wrapper messages, we need to return wrapped value directly
    // because they can't be used the same way as primitives
    if (isWellKnownPrimitive(innerResult)) {
      return innerResult.value
    }
    return innerResult
  }

  getBool(namespace: string, key: string, ctx?: ClientContext): boolean {
    const wrapper = new BoolValue()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return wrapper.value
  }

  getInt(namespace: string, key: string, ctx?: ClientContext): bigint {
    const wrapper = new Int64Value()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return wrapper.value
  }

  getFloat(namespace: string, key: string, ctx?: ClientContext): number {
    const wrapper = new DoubleValue()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return wrapper.value
  }

  getString(namespace: string, key: string, ctx?: ClientContext): string {
    const wrapper = new StringValue()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return wrapper.value
  }

  getJSON(
    namespace: string,
    key: string,
    ctx?: ClientContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const wrapper = new Value()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return JSON.parse(wrapper.toJsonString())
  }

  getProto(namespace: string, key: string, ctx?: ClientContext): Any {
    if (ctx === undefined) {
      ctx = new ClientContext()
    }
    const result = this.store.evaluateType(namespace, key, ctx)
    if (IsDebugMode()) {
      console.log(
        `Evaluated ${namespace}/${key} using the following context: ${ctx.toString()} to get a protobuf value at path: ${result.evalResult.path.toString()}`,
      )
    }

    this.track(namespace, key, result, ctx)
    return result.evalResult.value
  }

  listContents(): ListContentsResponse {
    return this.store.listContents()
  }

  getConfigs(): configMap {
    return this.store.configs
  }

  evaluateAndUnpack(
    namespace: string,
    configKey: string,
    wrapper: BoolValue | StringValue | Int64Value | DoubleValue | Value,
    ctx?: ClientContext,
  ) {
    if (ctx === undefined) {
      ctx = new ClientContext()
    }
    const result = this.store.evaluateType(namespace, configKey, ctx)
    if (result.evalResult.value.unpackTo(wrapper) === undefined) {
      throw new Error("type mismatch")
    }
    if (IsDebugMode()) {
      console.log(
        `Evaluated ${namespace}/${configKey} using the following context: ${ctx.toString()} to get: ${wrapper.toJsonString()}`,
      )
    }

    this.track(namespace, configKey, result, ctx)
  }

  track(
    namespace: string,
    key: string,
    result: StoredEvalResult,
    ctx?: ClientContext,
  ) {
    if (this.eventsBatcher === undefined) {
      return
    }
    this.eventsBatcher
      .track(
        new FlagEvaluationEvent({
          repoKey: this.repository,
          commitSha: result.commitSHA,
          featureSha: result.configSHA,
          namespaceName: namespace,
          featureName: key,
          contextKeys: toContextKeysProto(ctx),
          resultPath: result.evalResult.path,
          clientEventTime: Timestamp.now(),
        }),
      )
      .catch((e) => {
        console.log(`Error tracking events: ${e}`)
      })
  }

  async initialize(fetchContents: boolean = true) {
    const registerResponse = await this.distClient.registerClient({
      repoKey: this.repository,
    })
    this.sessionKey = registerResponse.sessionKey
    if (fetchContents) {
      await this.updateStore()
    }
    this.eventsBatcher.init(this.sessionKey)
  }

  async updateStore() {
    const contentsResponse = await this.distClient.getRepositoryContents({
      repoKey: this.repository,
      sessionKey: this.sessionKey,
    })
    this.store.load(contentsResponse)
  }

  async shouldUpdateStore() {
    const versionResponse = await this.distClient.getRepositoryVersion({
      repoKey: this.repository,
      sessionKey: this.sessionKey,
    })
    const currentSha = this.store.getCommitSHA()
    return currentSha !== versionResponse.commitSha
  }

  async close() {
    this.closed = true
    if (this.timeout !== undefined) {
      this.timeout.unref()
    }
    if (this.eventsBatcher !== undefined) {
      await this.eventsBatcher.close()
    }
    await this.distClient.deregisterClient({
      sessionKey: this.sessionKey,
    })
  }
}

function IsDebugMode(): boolean {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("LEKKO_DEBUG") === "true"
  ) {
    return true
  }
  return typeof window === "undefined"
    ? process.env.LEKKO_DEBUG === "1"
    : "LEKKO_DEBUG" in window && window.LEKKO_DEBUG === 1
}
