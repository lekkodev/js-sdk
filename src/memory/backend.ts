import { DistributionService } from "../gen/lekko/backend/v1beta1/distribution_service_connect"
import { FlagEvaluationEvent, GetRepositoryContentsResponse } from "../gen/lekko/backend/v1beta1/distribution_service_pb"
import { RepositoryKey } from "../gen/lekko/client/v1beta1/configuration_service_pb"
import { createEnvelopeReadableStream } from "@connectrpc/connect/protocol"
import { requestHeader, trailerFlag, trailerParse, validateResponse, validateTrailer, } from "@connectrpc/connect/protocol-grpc-web";
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
import { type ClientContext } from "../context/context"
import { type SyncClient } from "../types/client"
import { Store, type StoredEvalResult } from "./store"
import { type ListContentsResponse } from "../gen/lekko/server/v1beta1/sdk_pb"
import { EventsBatcher, toContextKeysProto } from "./events"

const eventsBatchSize = 100

// An in-memory store that fetches configs from lekko's backend.
export class Backend implements SyncClient {
  public repository: RepositoryKey
  distClient: PromiseClient<typeof DistributionService>
  store: Store
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
  ) {
    this.distClient = createPromiseClient(DistributionService, transport)
    this.store = new Store(repositoryOwner, repositoryName)
    this.repository = RepositoryKey.fromJson({
      ownerName: repositoryOwner,
      repoName: repositoryName,
    })
    this.closed = false
    this.version = version
    this.eventsBatcher = new EventsBatcher(this.distClient, eventsBatchSize)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJSON(namespace: string, key: string, ctx?: ClientContext): any {
    const wrapper = new Value()
    this.evaluateAndUnpack(namespace, key, wrapper, ctx)
    return JSON.parse(wrapper.toJsonString())
  }

  getProto(namespace: string, key: string, ctx?: ClientContext): Any {
    const result = this.store.evaluateType(namespace, key, ctx)
    this.track(namespace, key, result, ctx)
    return result.evalResult.value
  }

  listContents(): ListContentsResponse {
    return this.store.listContents()
  }

  evaluateAndUnpack(
    namespace: string,
    configKey: string,
    wrapper: BoolValue | StringValue | Int64Value | DoubleValue | Value,
    ctx?: ClientContext,
  ) {
    const result = this.store.evaluateType(namespace, configKey, ctx)
    if (result.evalResult.value.unpackTo(wrapper) === undefined) {
      throw new Error("type mismatch")
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

  async initialize() {
    if (!(document && document.getElementById('lekkoHidden'))) {
      const registerResponse = await this.distClient.registerClient({
        repoKey: this.repository,
      })
      this.sessionKey = registerResponse.sessionKey
    } else {
      this.sessionKey = "";
    }
    await this.updateStore()
    this.eventsBatcher.init(this.sessionKey)
  }

  /**
   * Not implemented
   */
  async reinitialize(): Promise<void> {}

  /**
   * Not implemented
   *  */
  async createConfig(): Promise<void> {}

  async updateStore() {
    let contentsResponse = undefined;
    if (document) {
      const el = document.getElementById('lekkoHidden');
      if (el && el.textContent) {
        const binData = Uint8Array.from(el.textContent.split(',').map(Number));
        const blob = new Blob([binData]);

        const reader = createEnvelopeReadableStream(blob.stream()).getReader();
        let trailer;
        let message;
        for (;;) {
          const r = await reader.read();
          if (r.done) {
            break;
          }
          const { flags, data } = r.value;
          if (flags === trailerFlag) {
            if (trailer !== undefined) {
              throw "extra trailer";
            }
            // Unary responses require exactly one response message, but in
            // case of an error, it is perfectly valid to have a response body
            // that only contains error trailers.
            trailer = trailerParse(data);
            continue;
          }
          if (message !== undefined) {
            throw "extra message";
          }
          contentsResponse = GetRepositoryContentsResponse.fromBinary(data);
        }
      }
    }
    if (!contentsResponse) {
      contentsResponse = await this.distClient.getRepositoryContents({
        repoKey: this.repository,
        sessionKey: this.sessionKey,
      })
    }
    this.store.load(contentsResponse).catch((e) => {
      console.log(`Error loading repository contents: ${e}`)
    })
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
