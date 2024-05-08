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

// @generated by protoc-gen-es v1.9.0 with parameter "target=ts,import_extension=none"
// @generated from file lekko/client/v1beta1/configuration_service.proto (package lekko.client.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any as Any$1, Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message lekko.client.v1beta1.RepositoryKey
 */
export class RepositoryKey extends Message<RepositoryKey> {
  /**
   * @generated from field: string owner_name = 1;
   */
  ownerName = "";

  /**
   * @generated from field: string repo_name = 2;
   */
  repoName = "";

  constructor(data?: PartialMessage<RepositoryKey>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.RepositoryKey";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "owner_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "repo_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RepositoryKey {
    return new RepositoryKey().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RepositoryKey {
    return new RepositoryKey().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RepositoryKey {
    return new RepositoryKey().fromJsonString(jsonString, options);
  }

  static equals(a: RepositoryKey | PlainMessage<RepositoryKey> | undefined, b: RepositoryKey | PlainMessage<RepositoryKey> | undefined): boolean {
    return proto3.util.equals(RepositoryKey, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetBoolValueRequest
 */
export class GetBoolValueRequest extends Message<GetBoolValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetBoolValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetBoolValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetBoolValueRequest {
    return new GetBoolValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetBoolValueRequest {
    return new GetBoolValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetBoolValueRequest {
    return new GetBoolValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetBoolValueRequest | PlainMessage<GetBoolValueRequest> | undefined, b: GetBoolValueRequest | PlainMessage<GetBoolValueRequest> | undefined): boolean {
    return proto3.util.equals(GetBoolValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetBoolValueResponse
 */
export class GetBoolValueResponse extends Message<GetBoolValueResponse> {
  /**
   * @generated from field: bool value = 1;
   */
  value = false;

  constructor(data?: PartialMessage<GetBoolValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetBoolValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetBoolValueResponse {
    return new GetBoolValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetBoolValueResponse {
    return new GetBoolValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetBoolValueResponse {
    return new GetBoolValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetBoolValueResponse | PlainMessage<GetBoolValueResponse> | undefined, b: GetBoolValueResponse | PlainMessage<GetBoolValueResponse> | undefined): boolean {
    return proto3.util.equals(GetBoolValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetIntValueRequest
 */
export class GetIntValueRequest extends Message<GetIntValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetIntValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetIntValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetIntValueRequest {
    return new GetIntValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetIntValueRequest {
    return new GetIntValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetIntValueRequest {
    return new GetIntValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetIntValueRequest | PlainMessage<GetIntValueRequest> | undefined, b: GetIntValueRequest | PlainMessage<GetIntValueRequest> | undefined): boolean {
    return proto3.util.equals(GetIntValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetIntValueResponse
 */
export class GetIntValueResponse extends Message<GetIntValueResponse> {
  /**
   * @generated from field: int64 value = 1;
   */
  value = protoInt64.zero;

  constructor(data?: PartialMessage<GetIntValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetIntValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetIntValueResponse {
    return new GetIntValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetIntValueResponse {
    return new GetIntValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetIntValueResponse {
    return new GetIntValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetIntValueResponse | PlainMessage<GetIntValueResponse> | undefined, b: GetIntValueResponse | PlainMessage<GetIntValueResponse> | undefined): boolean {
    return proto3.util.equals(GetIntValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetFloatValueRequest
 */
export class GetFloatValueRequest extends Message<GetFloatValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetFloatValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetFloatValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFloatValueRequest {
    return new GetFloatValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFloatValueRequest {
    return new GetFloatValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFloatValueRequest {
    return new GetFloatValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetFloatValueRequest | PlainMessage<GetFloatValueRequest> | undefined, b: GetFloatValueRequest | PlainMessage<GetFloatValueRequest> | undefined): boolean {
    return proto3.util.equals(GetFloatValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetFloatValueResponse
 */
export class GetFloatValueResponse extends Message<GetFloatValueResponse> {
  /**
   * @generated from field: double value = 1;
   */
  value = 0;

  constructor(data?: PartialMessage<GetFloatValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetFloatValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFloatValueResponse {
    return new GetFloatValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFloatValueResponse {
    return new GetFloatValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFloatValueResponse {
    return new GetFloatValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetFloatValueResponse | PlainMessage<GetFloatValueResponse> | undefined, b: GetFloatValueResponse | PlainMessage<GetFloatValueResponse> | undefined): boolean {
    return proto3.util.equals(GetFloatValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetStringValueRequest
 */
export class GetStringValueRequest extends Message<GetStringValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetStringValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetStringValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetStringValueRequest {
    return new GetStringValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetStringValueRequest {
    return new GetStringValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetStringValueRequest {
    return new GetStringValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetStringValueRequest | PlainMessage<GetStringValueRequest> | undefined, b: GetStringValueRequest | PlainMessage<GetStringValueRequest> | undefined): boolean {
    return proto3.util.equals(GetStringValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetStringValueResponse
 */
export class GetStringValueResponse extends Message<GetStringValueResponse> {
  /**
   * @generated from field: string value = 1;
   */
  value = "";

  constructor(data?: PartialMessage<GetStringValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetStringValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetStringValueResponse {
    return new GetStringValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetStringValueResponse {
    return new GetStringValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetStringValueResponse {
    return new GetStringValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetStringValueResponse | PlainMessage<GetStringValueResponse> | undefined, b: GetStringValueResponse | PlainMessage<GetStringValueResponse> | undefined): boolean {
    return proto3.util.equals(GetStringValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetProtoValueRequest
 */
export class GetProtoValueRequest extends Message<GetProtoValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetProtoValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetProtoValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetProtoValueRequest {
    return new GetProtoValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetProtoValueRequest {
    return new GetProtoValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetProtoValueRequest {
    return new GetProtoValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetProtoValueRequest | PlainMessage<GetProtoValueRequest> | undefined, b: GetProtoValueRequest | PlainMessage<GetProtoValueRequest> | undefined): boolean {
    return proto3.util.equals(GetProtoValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetProtoValueResponse
 */
export class GetProtoValueResponse extends Message<GetProtoValueResponse> {
  /**
   * @generated from field: google.protobuf.Any value = 1;
   */
  value?: Any$1;

  /**
   * @generated from field: lekko.client.v1beta1.Any value_v2 = 2;
   */
  valueV2?: Any;

  constructor(data?: PartialMessage<GetProtoValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetProtoValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "message", T: Any$1 },
    { no: 2, name: "value_v2", kind: "message", T: Any },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetProtoValueResponse {
    return new GetProtoValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetProtoValueResponse {
    return new GetProtoValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetProtoValueResponse {
    return new GetProtoValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetProtoValueResponse | PlainMessage<GetProtoValueResponse> | undefined, b: GetProtoValueResponse | PlainMessage<GetProtoValueResponse> | undefined): boolean {
    return proto3.util.equals(GetProtoValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.Any
 */
export class Any extends Message<Any> {
  /**
   * @generated from field: string type_url = 1;
   */
  typeUrl = "";

  /**
   * @generated from field: bytes value = 2;
   */
  value = new Uint8Array(0);

  constructor(data?: PartialMessage<Any>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.Any";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "type_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Any {
    return new Any().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Any {
    return new Any().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Any {
    return new Any().fromJsonString(jsonString, options);
  }

  static equals(a: Any | PlainMessage<Any> | undefined, b: Any | PlainMessage<Any> | undefined): boolean {
    return proto3.util.equals(Any, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetJSONValueRequest
 */
export class GetJSONValueRequest extends Message<GetJSONValueRequest> {
  /**
   * @generated from field: string key = 1;
   */
  key = "";

  /**
   * @generated from field: map<string, lekko.client.v1beta1.Value> context = 2;
   */
  context: { [key: string]: Value } = {};

  /**
   * @generated from field: string namespace = 3;
   */
  namespace = "";

  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 4;
   */
  repoKey?: RepositoryKey;

  constructor(data?: PartialMessage<GetJSONValueRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetJSONValueRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Value} },
    { no: 3, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "repo_key", kind: "message", T: RepositoryKey },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetJSONValueRequest {
    return new GetJSONValueRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetJSONValueRequest {
    return new GetJSONValueRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetJSONValueRequest {
    return new GetJSONValueRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetJSONValueRequest | PlainMessage<GetJSONValueRequest> | undefined, b: GetJSONValueRequest | PlainMessage<GetJSONValueRequest> | undefined): boolean {
    return proto3.util.equals(GetJSONValueRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.GetJSONValueResponse
 */
export class GetJSONValueResponse extends Message<GetJSONValueResponse> {
  /**
   * @generated from field: bytes value = 1;
   */
  value = new Uint8Array(0);

  constructor(data?: PartialMessage<GetJSONValueResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.GetJSONValueResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetJSONValueResponse {
    return new GetJSONValueResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetJSONValueResponse {
    return new GetJSONValueResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetJSONValueResponse {
    return new GetJSONValueResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetJSONValueResponse | PlainMessage<GetJSONValueResponse> | undefined, b: GetJSONValueResponse | PlainMessage<GetJSONValueResponse> | undefined): boolean {
    return proto3.util.equals(GetJSONValueResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.Value
 */
export class Value extends Message<Value> {
  /**
   * @generated from oneof lekko.client.v1beta1.Value.kind
   */
  kind: {
    /**
     * @generated from field: bool bool_value = 1;
     */
    value: boolean;
    case: "boolValue";
  } | {
    /**
     * @generated from field: int64 int_value = 2;
     */
    value: bigint;
    case: "intValue";
  } | {
    /**
     * @generated from field: double double_value = 3;
     */
    value: number;
    case: "doubleValue";
  } | {
    /**
     * @generated from field: string string_value = 4;
     */
    value: string;
    case: "stringValue";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Value>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.Value";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "bool_value", kind: "scalar", T: 8 /* ScalarType.BOOL */, oneof: "kind" },
    { no: 2, name: "int_value", kind: "scalar", T: 3 /* ScalarType.INT64 */, oneof: "kind" },
    { no: 3, name: "double_value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */, oneof: "kind" },
    { no: 4, name: "string_value", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "kind" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Value {
    return new Value().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Value {
    return new Value().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Value {
    return new Value().fromJsonString(jsonString, options);
  }

  static equals(a: Value | PlainMessage<Value> | undefined, b: Value | PlainMessage<Value> | undefined): boolean {
    return proto3.util.equals(Value, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.RegisterRequest
 */
export class RegisterRequest extends Message<RegisterRequest> {
  /**
   * @generated from field: lekko.client.v1beta1.RepositoryKey repo_key = 1;
   */
  repoKey?: RepositoryKey;

  /**
   * The namespaces to register within the repo. If empty,
   * all namespaces will be registered.
   *
   * @generated from field: repeated string namespace_list = 2;
   */
  namespaceList: string[] = [];

  constructor(data?: PartialMessage<RegisterRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.RegisterRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "repo_key", kind: "message", T: RepositoryKey },
    { no: 2, name: "namespace_list", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegisterRequest {
    return new RegisterRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegisterRequest {
    return new RegisterRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegisterRequest {
    return new RegisterRequest().fromJsonString(jsonString, options);
  }

  static equals(a: RegisterRequest | PlainMessage<RegisterRequest> | undefined, b: RegisterRequest | PlainMessage<RegisterRequest> | undefined): boolean {
    return proto3.util.equals(RegisterRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.RegisterResponse
 */
export class RegisterResponse extends Message<RegisterResponse> {
  constructor(data?: PartialMessage<RegisterResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.RegisterResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegisterResponse {
    return new RegisterResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegisterResponse {
    return new RegisterResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegisterResponse {
    return new RegisterResponse().fromJsonString(jsonString, options);
  }

  static equals(a: RegisterResponse | PlainMessage<RegisterResponse> | undefined, b: RegisterResponse | PlainMessage<RegisterResponse> | undefined): boolean {
    return proto3.util.equals(RegisterResponse, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.DeregisterRequest
 */
export class DeregisterRequest extends Message<DeregisterRequest> {
  constructor(data?: PartialMessage<DeregisterRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.DeregisterRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeregisterRequest {
    return new DeregisterRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeregisterRequest {
    return new DeregisterRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeregisterRequest {
    return new DeregisterRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeregisterRequest | PlainMessage<DeregisterRequest> | undefined, b: DeregisterRequest | PlainMessage<DeregisterRequest> | undefined): boolean {
    return proto3.util.equals(DeregisterRequest, a, b);
  }
}

/**
 * @generated from message lekko.client.v1beta1.DeregisterResponse
 */
export class DeregisterResponse extends Message<DeregisterResponse> {
  constructor(data?: PartialMessage<DeregisterResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "lekko.client.v1beta1.DeregisterResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeregisterResponse {
    return new DeregisterResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeregisterResponse {
    return new DeregisterResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeregisterResponse {
    return new DeregisterResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DeregisterResponse | PlainMessage<DeregisterResponse> | undefined, b: DeregisterResponse | PlainMessage<DeregisterResponse> | undefined): boolean {
    return proto3.util.equals(DeregisterResponse, a, b);
  }
}

