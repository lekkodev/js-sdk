import { type Any } from "@bufbuild/protobuf"
import { type ClientContext } from "../context/context"
import { type RepositoryKey } from "@buf/lekkodev_sdk.bufbuild_es/lekko/client/v1beta1/configuration_service_pb"

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
