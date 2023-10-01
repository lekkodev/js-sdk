import { createConnectTransport } from '@bufbuild/connect-web'

import { type Transport } from "@bufbuild/connect";

const APIKEY_INTERCEPTOR = (apiKey?: string) => (next: any) => async (req: any) => {
  if (apiKey) {
    req.header.set('apikey', apiKey);
  }
  return await next(req);
};

export class ClientTransportBuilder {
  hostname: string;
  apiKey?: string;

  constructor({hostname, apiKey} : {hostname: string, apiKey?: string}) {
    this.hostname = hostname;
    this.apiKey = apiKey;
  }

  async build(): Promise<Transport> {
      if (this.apiKey === undefined) {
        throw new Error("API Key required");
      }
      return createConnectTransport({
        baseUrl: this.hostname,
        interceptors: [APIKEY_INTERCEPTOR(this.apiKey)],
      });
  }
}
