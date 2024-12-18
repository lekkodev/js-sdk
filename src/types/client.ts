import { type Any } from "@bufbuild/protobuf"
import { type ClientContext } from "../context/context"
import { type RepositoryKey } from "../gen/lekko/client/v1beta1/configuration_service_pb"
import { type Store, type configMap } from "../memory/store"
import { GetRepositoryContentsResponse } from "../internal"

export interface Client {
  repository: RepositoryKey
  getBool: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<boolean>
  getInt: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<bigint>
  getFloat: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<number>
  getString: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<string>
  getJSON: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>
  getProto: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<Any>
  close: () => Promise<void>
}

export interface SyncClient {
  repository: RepositoryKey
  store: Store
  contentsResponse: GetRepositoryContentsResponse | undefined
  getBool: (namespace: string, key: string, ctx?: ClientContext) => boolean
  getInt: (namespace: string, key: string, ctx?: ClientContext) => bigint
  getFloat: (namespace: string, key: string, ctx?: ClientContext) => number
  getString: (namespace: string, key: string, ctx?: ClientContext) => string
  getJSON: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any
  getProto: (namespace: string, key: string, ctx?: ClientContext) => Any
  get: (namespace: string, key: string, ctx?: ClientContext) => unknown
  getConfigs: () => configMap
  close: () => Promise<void>
}

export class ClientNotInitializedError extends Error {}
