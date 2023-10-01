import { Value } from '@buf/lekkodev_sdk.bufbuild_es/lekko/client/v1beta1/configuration_service_pb';
import { TransportClient } from './client';
import { ClientContext } from './context/context';
import { Backend } from './memory/backend';
import { ClientTransportBuilder } from './transport-builder';
import { Client } from './types/client';
// @ts-ignore
import { version } from './version';

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

type BackendOptions = {
  apiKey?: string
  hostname? : string
  repositoryOwner: string
  repositoryName: string
  updateIntervalMs?: number
}

const defaultUpdateIntervalMs = 15 * 1000; // 15s

async function initCachedAPIClient(options: BackendOptions): Promise<Client> {
  const transport = await new ClientTransportBuilder({
    hostname: options.hostname ?? "https://prod.api.lekko.dev/api",
    apiKey: options.apiKey
  }).build();
  const client = new Backend(
    transport, 
    options.repositoryOwner, 
    options.repositoryName, 
    sdkVersion(),
    options.updateIntervalMs ?? defaultUpdateIntervalMs, 
  );
  await client.initialize();
  return client;
}

function sdkVersion() : string {
  const v = (version.startsWith('v')) ? version : `v${version}`;
  return 'js-' + v;
}

export { ClientContext, TransportClient, Value, initAPIClient, initCachedAPIClient, type Client };

