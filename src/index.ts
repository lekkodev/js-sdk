import { Value } from '@buf/lekkodev_sdk.bufbuild_es/lekko/client/v1beta1/configuration_service_pb';
import { TransportClient } from './client';
import { ClientContext } from './context/context';
import { ClientTransportBuilder } from './transport-builder';
import { Client } from './types/client';

type APIOptions = {
  apiKey: string
  hostname? : string
  repositoryOwner: string
  repositoryName: string
}

async function initAPIClient(options: APIOptions): Promise<Client> {
  const transport = await new ClientTransportBuilder(
    {
      hostname: options.hostname ?? "https://prod.api.lekko.dev/api",
      apiKey: options.apiKey
    }).build();
  return new TransportClient(options.repositoryOwner, options.repositoryName, transport);
}

export { ClientContext, TransportClient, Value, initAPIClient, type Client };

