import { createGrpcWebTransport } from "@bufbuild/connect-web"

import { type Transport } from "@bufbuild/connect"

const APIKEY_INTERCEPTOR =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (apiKey?: string) => (next: any) => async (req: any) => {
    if (apiKey !== undefined) {
      req.header.set("apikey", apiKey)
    }
    return next(req)
  }

export class ClientTransportBuilder {
  hostname: string
  apiKey?: string

  constructor({ hostname, apiKey }: { hostname: string; apiKey?: string }) {
    this.hostname = hostname
    this.apiKey = apiKey
  }

  build(): Transport {
    if (this.apiKey === undefined) {
      throw new Error("API Key required")
    }
    return createGrpcWebTransport({
      baseUrl: this.hostname,
      interceptors: [APIKEY_INTERCEPTOR(this.apiKey)],
    })
  }
}
