import {
  type Any,
  BoolValue,
  DoubleValue,
  Int64Value,
  StringValue,
  Timestamp,
  Value,
} from "@bufbuild/protobuf"
import {
  type PromiseClient,
  type Transport,
  createPromiseClient,
} from "@connectrpc/connect"
import { ClientContext } from "../context/context"
import { logDebug, logError } from "../debug"
import { DistributionService } from "../gen/lekko/backend/v1beta1/distribution_service_connect"
import {
  FlagEvaluationEvent,
  GetRepositoryContentsResponse,
} from "../gen/lekko/backend/v1beta1/distribution_service_pb"
import { RepositoryKey } from "../gen/lekko/client/v1beta1/configuration_service_pb"
import { type ListContentsResponse } from "../gen/lekko/server/v1beta1/sdk_pb"
import { type SyncClient } from "../types/client"
import { isWellKnownPrimitive } from "../types/proto"
import { EventsBatcher, toContextKeysProto } from "./events"
import { Store, type StoredEvalResult, type configMap } from "./store"

const eventsBatchSize = 100

// An in-memory store that fetches configs from lekko's backend.
export class Backend implements SyncClient {
  public repository: RepositoryKey
  distClient: PromiseClient<typeof DistributionService>
  public store: Store
  sessionKey?: string
  closed: boolean
  eventsBatcher: EventsBatcher
  version: string
  updateIntervalId?: NodeJS.Timeout
  updateIntervalMs?: number
  keepContentsResponse: boolean
  public contentsResponse: GetRepositoryContentsResponse | undefined

  constructor(
    transport: Transport,
    repositoryOwner: string,
    repositoryName: string,
    version: string,
    updateIntervalMs?: number,
    store?: Store,
    keepContentsResponse?: boolean,
  ) {
    this.distClient = createPromiseClient(DistributionService, transport)
    this.store = store ?? new Store(repositoryOwner, repositoryName)
    this.repository = RepositoryKey.fromJson({
      ownerName: repositoryOwner,
      repoName: repositoryName,
    })
    this.closed = false
    this.version = version
    this.updateIntervalMs = updateIntervalMs
    this.eventsBatcher = new EventsBatcher(this.distClient, eventsBatchSize)
    this.keepContentsResponse = keepContentsResponse ?? false
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
    logDebug(
      `[lekko] Evaluated ${namespace}/${key} using the following context: ${ctx?.toString()} to get: ${innerResult.toJsonString()}`,
    )

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
    logDebug(
      `[lekko] Evaluated ${namespace}/${key} using the following context: ${ctx.toString()} to get a protobuf value at path: ${result.evalResult.path.toString()}`,
    )

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
    logDebug(
      `[lekko] Evaluated ${namespace}/${configKey} using the following context: ${ctx.toString()} to get: ${wrapper.toJsonString()}`,
    )

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
    if (this.updateIntervalMs != null && this.updateIntervalMs > 0) {
      this.updateIntervalId = globalThis.setInterval(() => {
        this.checkForUpdates().catch((error) => {
          logError("[lekko] failed to update from remote", error)
        })
      }, this.updateIntervalMs)
    }
    this.eventsBatcher.init(this.sessionKey)
  }

  async checkForUpdates() {
    if (this.closed) {
      return
    }
    if (await this.shouldUpdateStore()) {
      await this.updateStore()
    }
  }

  async updateStore() {
    const contentsResponse = await this.distClient.getRepositoryContents({
      repoKey: this.repository,
      sessionKey: this.sessionKey,
    })
    if (this.keepContentsResponse) {
      this.contentsResponse = contentsResponse
    }
    this.store.load(contentsResponse)
    logDebug(
      `[lekko] Loaded remote lekkos from: ${this.repository.ownerName}/${this.repository.repoName}`,
      `commit hash: ${contentsResponse.commitSha}.`,
    )
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
    if (this.updateIntervalId !== undefined) {
      globalThis.clearInterval(this.updateIntervalId)
    }
    if (this.eventsBatcher !== undefined) {
      await this.eventsBatcher.close()
    }
    await this.distClient.deregisterClient({
      sessionKey: this.sessionKey,
    })
  }
}
