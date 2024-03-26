// Copyright 2022 Lekko Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v1.7.2 with parameter "target=ts,import_extension=none"
// @generated from file lekko/server/v1beta1/sdk.proto (package lekko.server.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from "@bufbuild/protobuf"
import { Message, proto3 } from "@bufbuild/protobuf"
import { RepositoryKey } from "../../client/v1beta1/configuration_service_pb"

/**
 * @generated from message lekko.server.v1beta1.ListContentsRequest
 */
export class ListContentsRequest extends Message<ListContentsRequest> {
  constructor(data?: PartialMessage<ListContentsRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.server.v1beta1.ListContentsRequest"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ListContentsRequest {
    return new ListContentsRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ListContentsRequest {
    return new ListContentsRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ListContentsRequest {
    return new ListContentsRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: ListContentsRequest | PlainMessage<ListContentsRequest> | undefined,
    b: ListContentsRequest | PlainMessage<ListContentsRequest> | undefined,
  ): boolean {
    return proto3.util.equals(ListContentsRequest, a, b)
  }
}

/**
 * @generated from message lekko.server.v1beta1.ListContentsResponse
 */
export class ListContentsResponse extends Message<ListContentsResponse> {
  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 1;
   */
  repoKey?: RepositoryKey

  /**
   * Git commit sha that the contents were derived from.
   *
   * @generated from field: string commit_sha = 2;
   */
  commitSha = ""

  /**
   * sha-256 hash of the cached contents.
   *
   * @generated from field: string content_hash = 3;
   */
  contentHash = ""

  /**
   * @generated from field: repeated lekko.server.v1beta1.Namespace namespaces = 4;
   */
  namespaces: Namespace[] = []

  constructor(data?: PartialMessage<ListContentsResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.server.v1beta1.ListContentsResponse"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "repo_key", kind: "message", T: RepositoryKey },
    { no: 2, name: "commit_sha", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    {
      no: 3,
      name: "content_hash",
      kind: "scalar",
      T: 9 /* ScalarType.STRING */,
    },
    {
      no: 4,
      name: "namespaces",
      kind: "message",
      T: Namespace,
      repeated: true,
    },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ListContentsResponse {
    return new ListContentsResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ListContentsResponse {
    return new ListContentsResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ListContentsResponse {
    return new ListContentsResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: ListContentsResponse | PlainMessage<ListContentsResponse> | undefined,
    b: ListContentsResponse | PlainMessage<ListContentsResponse> | undefined,
  ): boolean {
    return proto3.util.equals(ListContentsResponse, a, b)
  }
}

/**
 * @generated from message lekko.server.v1beta1.Namespace
 */
export class Namespace extends Message<Namespace> {
  /**
   * @generated from field: string name = 1;
   */
  name = ""

  /**
   * @generated from field: repeated lekko.server.v1beta1.Config configs = 2;
   */
  configs: Config[] = []

  constructor(data?: PartialMessage<Namespace>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.server.v1beta1.Namespace"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "configs", kind: "message", T: Config, repeated: true },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Namespace {
    return new Namespace().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Namespace {
    return new Namespace().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Namespace {
    return new Namespace().fromJsonString(jsonString, options)
  }

  static equals(
    a: Namespace | PlainMessage<Namespace> | undefined,
    b: Namespace | PlainMessage<Namespace> | undefined,
  ): boolean {
    return proto3.util.equals(Namespace, a, b)
  }
}

/**
 * @generated from message lekko.server.v1beta1.Config
 */
export class Config extends Message<Config> {
  /**
   * @generated from field: string name = 1;
   */
  name = ""

  /**
   * Git blob sha of the config.
   *
   * @generated from field: string sha = 2;
   */
  sha = ""

  constructor(data?: PartialMessage<Config>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.server.v1beta1.Config"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "sha", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Config {
    return new Config().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Config {
    return new Config().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Config {
    return new Config().fromJsonString(jsonString, options)
  }

  static equals(
    a: Config | PlainMessage<Config> | undefined,
    b: Config | PlainMessage<Config> | undefined,
  ): boolean {
    return proto3.util.equals(Config, a, b)
  }
}
