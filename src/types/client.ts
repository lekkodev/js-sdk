import { type Any } from "@bufbuild/protobuf";
import { type ClientContext } from "../context/context";

export interface Client {
  getBool: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<boolean>;
  getInt: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<bigint>;
  getFloat: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<number>;
  getString: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<string>;
  getJSON: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  getProto: (
    namespace: string,
    key: string,
    ctx?: ClientContext,
  ) => Promise<Any>;
  close: () => Promise<void>;
}
