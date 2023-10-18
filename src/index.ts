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
  hostname?: string
  repositoryOwner: string
  repositoryName: string
}

function initAPIClient(options: APIOptions): Client {
  const transport = new ClientTransportBuilder({
    hostname: options.hostname ?? "https://app.lekko.com/api/",
    apiKey: options.apiKey,
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
