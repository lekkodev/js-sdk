import {
  Value,
  RepositoryKey,
} from "./gen/lekko/client/v1beta1/configuration_service_pb"
import { TransportClient } from "./client"
import { ClientContext } from "./context/context"
import { ClientTransportBuilder } from "./transport-builder"
import { type SyncClient, type Client } from "./types/client"
import { Backend } from "./memory/backend"
import { version } from "./version"
import { GetRepositoryContentsResponse } from "./gen/lekko/backend/v1beta1/distribution_service_pb"
import { toUint8Array } from "js-base64"

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
  serverPort?: number
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
  )
  await client.initialize()
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
  return client
}

export {
  ClientContext,
  TransportClient,
  Value,
  initAPIClient,
  type Client,
  type SyncClient,
  RepositoryKey,
  initCachedAPIClient,
  initAPIClientFromContents,
}
