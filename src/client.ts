import { ConfigurationService } from "./gen/lekko/client/v1beta1/configuration_service_connect"
import {
  GetBoolValueRequest,
  GetFloatValueRequest,
  GetIntValueRequest,
  GetJSONValueRequest,
  GetProtoValueRequest,
  GetStringValueRequest,
  RepositoryKey,
} from "./gen/lekko/client/v1beta1/configuration_service_pb"
import {
  type PromiseClient,
  type Transport,
  createPromiseClient,
} from "@connectrpc/connect"
import { Any } from "@bufbuild/protobuf"
import { ClientContext } from "./context/context"
import { type Client } from "./types/client"

export class TransportClient implements Client {
  public repository: RepositoryKey
  baseContext: ClientContext
  client: PromiseClient<typeof ConfigurationService>

  constructor(
    repositoryOwner: string,
    repositoryName: string,
    transport: Transport,
  ) {
    this.baseContext = new ClientContext()
    this.repository = RepositoryKey.fromJson({
      ownerName: repositoryOwner,
      repoName: repositoryName,
    })
    this.client = createPromiseClient(ConfigurationService, transport)
  }

  async close(): Promise<void> {}

  async getBool(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
  ): Promise<boolean> {
    const req = GetBoolValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getBoolValue(req)
    return res.value
  }

  async getInt(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
  ): Promise<bigint> {
    const req = GetIntValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getIntValue(req)
    return res.value
  }

  async getFloat(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
  ): Promise<number> {
    const req = GetFloatValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getFloatValue(req)
    return res.value
  }

  async getJSON(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const req = GetJSONValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getJSONValue(req)

    try {
      const textDecoder = new TextDecoder()
      const decoded = textDecoder.decode(res.value)
      return JSON.parse(decoded)
    } catch (error) {
      console.error("An error occurred while decoding or parsing JSON: ", error)
    }

    return {}
  }

  async getProto(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
  ): Promise<Any> {
    const req = GetProtoValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getProtoValue(req)
    if (res.valueV2 !== undefined) {
      return new Any({
        typeUrl: res.valueV2.typeUrl,
        value: res.valueV2.value,
      })
    }
    return new Any({
      ...res.value,
    })
  }

  async getString(
    namespace: string,
    key: string,
    ctx: ClientContext = new ClientContext(),
  ): Promise<string> {
    const req = GetStringValueRequest.fromJson({
      namespace,
      key,
    })
    req.repoKey = this.repository
    Object.assign(req.context, this.baseContext.data, ctx.data)
    const res = await this.client.getStringValue(req)
    return res.value
  }
}
