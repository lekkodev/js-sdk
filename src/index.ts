import {
  Value,
  RepositoryKey,
} from "./gen/lekko/client/v1beta1/configuration_service_pb"
import { TransportClient } from "./client"
import { ClientContext, type ContextObject } from "./context/context"
import { ClientTransportBuilder } from "./transport-builder"
import {
  type SyncClient,
  type Client,
  ClientNotInitializedError,
} from "./types/client"
import { Backend } from "./memory/backend"
import { version } from "./version"
import { GetRepositoryContentsResponse } from "./gen/lekko/backend/v1beta1/distribution_service_pb"
import { toUint8Array } from "js-base64"
import { type configMap } from "./memory/store"
import {
  type ConfigCombination,
  getNamespaceCombinations,
} from "./evaluation/combinations"
import { type Any } from "@bufbuild/protobuf"
import { logDebug, logInfo, logError } from "./debug"
import {
  getAPIKeyFromEnv,
  getRepositoryNameFromEnv,
  getRepositoryOwnerFromEnv,
} from "./env"

interface LekkoGlobal {
  lekkoClient?: SyncClient
}

const _global = globalThis as LekkoGlobal

export function getOptionalClient(): SyncClient | undefined {
  return _global.lekkoClient
}

function getClientOrThrow(client?: SyncClient): SyncClient {
  client = client ?? getOptionalClient()
  if (client === undefined) {
    throw new ClientNotInitializedError()
  }
  return client
}

interface LekkoOptions {
  apiKey?: string
  repositoryOwner?: string
  repositoryName?: string
  updateIntervalMs?: number
  keepContentsResponse?: boolean
}

const MIN_UPDATE_INTERVAL = 1 * 1000
const DEFAULT_UPDATE_INTERVAL = 15 * 1000

/** Initialize Lekko connection using `options`. */
export async function initLekko(options?: LekkoOptions) {
  const apiKey = options?.apiKey ?? getAPIKeyFromEnv()
  if (apiKey === undefined) {
    return
  }

  const repositoryOwner =
    options?.repositoryOwner ?? getRepositoryOwnerFromEnv()
  if (repositoryOwner === undefined) {
    return
  }

  const repositoryName = options?.repositoryName ?? getRepositoryNameFromEnv()
  if (repositoryName === undefined) {
    return
  }

  const updateIntervalMs = options?.updateIntervalMs ?? DEFAULT_UPDATE_INTERVAL
  if (updateIntervalMs < MIN_UPDATE_INTERVAL) {
    throw new Error(
      `update interval is too small, minimum ${MIN_UPDATE_INTERVAL}`,
    )
  }

  await initClient({
    apiKey,
    repositoryOwner,
    repositoryName,
    updateIntervalMs,
    keepContentsResponse: options?.keepContentsResponse,
  })
}

export async function initClient(options: BackendOptions): Promise<SyncClient> {
  const client = await initCachedAPIClient(options)
  _global.lekkoClient = client
  return client
}

export function get(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
) {
  return getClientOrThrow(client).get(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getBool(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
): boolean {
  return getClientOrThrow(client).getBool(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getInt(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
): bigint {
  return getClientOrThrow(client).getInt(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getFloat(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
): number {
  return getClientOrThrow(client).getFloat(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getString(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
): string {
  return getClientOrThrow(client).getString(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getJSON(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return getClientOrThrow(client).getJSON(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

export function getProto(
  namespace: string,
  key: string,
  ctx?: Record<string, string | number | boolean>,
  client?: SyncClient,
): Any {
  return getClientOrThrow(client).getProto(
    namespace,
    key,
    ClientContext.fromObject(ctx),
  )
}

interface APIOptions {
  apiKey: string
  repositoryOwner: string
  repositoryName: string
  /**
   * For local development. You can pass the URL to an alternative Lekko config
   * server (e.g. using @lekko/node-server-sdk).
   */
  hostname?: string
  /**
   * For local development to use with a Lekko config server (e.g. using
   * @lekko/node-server-sdk) which is set to use a local repository.
   * The target server should use this path to read from a config repository
   * on local disk. If localPath is omitted, a default location will be used.
   */
  localPath?: string
}

function initAPIClient(options: APIOptions): Client {
  const transport = new ClientTransportBuilder({
    hostname: options.hostname ?? "https://web.api.lekko.dev",
    apiKey: options.apiKey,
    localPath: options.localPath,
  }).build()
  return new TransportClient(
    options.repositoryOwner,
    options.repositoryName,
    transport,
  )
}

interface BackendOptions {
  apiKey?: string
  hostname?: string
  repositoryOwner: string
  repositoryName: string
  updateIntervalMs?: number
  keepContentsResponse?: boolean
}

function sdkVersion(): string {
  const v = version.startsWith("v") ? version : `v${version}`
  return "js-" + v
}

async function initCachedAPIClient(
  options: BackendOptions,
): Promise<SyncClient> {
  const transport = new ClientTransportBuilder({
    hostname: options.hostname ?? "https://web.api.lekko.dev",
    apiKey: options.apiKey,
  }).build()
  const client = new Backend(
    transport,
    options.repositoryOwner,
    options.repositoryName,
    sdkVersion(),
    options.updateIntervalMs,
    undefined,
    options.keepContentsResponse,
  )
  await client.initialize()
  logInfo(
    `[lekko] Connected to ${options.repositoryOwner}/${options.repositoryName} using API key "${options.apiKey?.slice(0, 12)}..."`,
  )
  return client
}

/**
 * This method returns Backend explicitly and doesn't call initialize()
 * and leaves it to the caller
 * @internal Use for hydrated initialization
 */
function initAPIClientFromContents(
  encodedContents: string,
  options: BackendOptions,
): Backend {
  const transport = new ClientTransportBuilder({
    hostname: options.hostname ?? "https://web.api.lekko.dev",
    apiKey: options.apiKey,
  }).build()
  const client = new Backend(
    transport,
    options.repositoryOwner,
    options.repositoryName,
    sdkVersion(),
  )
  let contents: GetRepositoryContentsResponse
  try {
    contents = GetRepositoryContentsResponse.fromBinary(
      toUint8Array(encodedContents),
    )
  } catch (e) {
    throw new Error(
      `Failed to deserialize repository contents: ${(e as Error).message}`,
    )
  }
  client.store.load(contents)
  logDebug(
    `[lekko] Loaded remote lekkos from: ${options.repositoryOwner}/${options.repositoryName}`,
    `commit hash: ${contents.commitSha}.`,
  )
  return client
}

export {
  type ContextObject,
  ClientContext,
  TransportClient,
  Value,
  initAPIClient,
  type Client,
  type SyncClient,
  RepositoryKey,
  initCachedAPIClient,
  initAPIClientFromContents,
  type configMap,
  getNamespaceCombinations,
  type ConfigCombination,
  logDebug,
  logInfo,
  logError,
  ClientNotInitializedError,
}
