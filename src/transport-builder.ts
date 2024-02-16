import { createGrpcWebTransport } from "@bufbuild/connect-web"

import { type Transport, type Interceptor } from "@bufbuild/connect"

const APIKEY_INTERCEPTOR: (apiKey?: string) => Interceptor =
  (apiKey?: string) => (next) => async (req) => {
    if (apiKey !== undefined) {
      req.header.set("apikey", apiKey)
    }
    return next(req)
  }

const LOCAL_PATH_INTERCEPTOR: (path?: string) => Interceptor =
  (path?: string) => (next) => async (req) => {
    if (path !== undefined) {
      req.header.set("localpath", path)
    }
    return next(req)
  }

export class ClientTransportBuilder {
  hostname: string
  apiKey?: string
  localPath?: string

  constructor({
    hostname,
    apiKey,
    localPath,
  }: {
    hostname: string
    apiKey?: string
    localPath?: string
  }) {
    this.hostname = hostname
    this.apiKey = apiKey
    this.localPath = localPath
  }

  build(): Transport {
    if (this.apiKey === undefined) {
      throw new Error("API Key required")
    }
    return createGrpcWebTransport({
      baseUrl: this.hostname,
      interceptors: [
        APIKEY_INTERCEPTOR(this.apiKey),
        LOCAL_PATH_INTERCEPTOR(this.localPath),
      ],
    })
  }
}
