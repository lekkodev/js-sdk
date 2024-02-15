import {
  Value,
  RepositoryKey,
} from "@buf/lekkodev_sdk.bufbuild_es/lekko/client/v1beta1/configuration_service_pb"
import { TransportClient } from "./client"
import { ClientContext } from "./context/context"
import { ClientTransportBuilder } from "./transport-builder"
import { type Client } from "./types/client"

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
    hostname: options.hostname ?? "https://app.lekko.com/api/",
    apiKey: options.apiKey,
    localPath: options.localPath,
  }).build()
  return new TransportClient(
    options.repositoryOwner,
    options.repositoryName,
    transport,
  )
}

export {
  ClientContext,
  TransportClient,
  Value,
  initAPIClient,
  type Client,
  RepositoryKey,
}
