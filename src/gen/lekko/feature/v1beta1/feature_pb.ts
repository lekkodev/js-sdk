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
// @generated from file lekko/feature/v1beta1/feature.proto (package lekko.feature.v1beta1, syntax proto3)
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
import { Any as Any$1, Message, proto3, Struct } from "@bufbuild/protobuf"
import { Rule } from "../../rules/v1beta2/rules_pb"
import { Rule as Rule$1 } from "../../rules/v1beta3/rules_pb"

/**
 * Enumerates the canonical types that lekko supports
 *
 * @generated from enum lekko.feature.v1beta1.FeatureType
 */
export enum FeatureType {
  /**
   * @generated from enum value: FEATURE_TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: FEATURE_TYPE_BOOL = 1;
   */
  BOOL = 1,

  /**
   * @generated from enum value: FEATURE_TYPE_INT = 2;
   */
  INT = 2,

  /**
   * @generated from enum value: FEATURE_TYPE_FLOAT = 3;
   */
  FLOAT = 3,

  /**
   * @generated from enum value: FEATURE_TYPE_STRING = 4;
   */
  STRING = 4,

  /**
   * @generated from enum value: FEATURE_TYPE_JSON = 5;
   */
  JSON = 5,

  /**
   * @generated from enum value: FEATURE_TYPE_PROTO = 6;
   */
  PROTO = 6,
}
// Retrieve enum metadata with: proto3.getEnumType(FeatureType)
proto3.util.setEnumType(FeatureType, "lekko.feature.v1beta1.FeatureType", [
  { no: 0, name: "FEATURE_TYPE_UNSPECIFIED" },
  { no: 1, name: "FEATURE_TYPE_BOOL" },
  { no: 2, name: "FEATURE_TYPE_INT" },
  { no: 3, name: "FEATURE_TYPE_FLOAT" },
  { no: 4, name: "FEATURE_TYPE_STRING" },
  { no: 5, name: "FEATURE_TYPE_JSON" },
  { no: 6, name: "FEATURE_TYPE_PROTO" },
])

/**
 * A prototype of the wrapper type that will be used to house all feature flags for
 * the 'homegrown' feature flagging solution:
 * User-defined proto defintions, and a tree-based constraints system.
 * A real-life example of this in practice is visualized here:
 * https://lucid.app/lucidchart/f735298f-db2c-4207-8d14-28b375a25871/edit?view_items=bV8G0U69AJNc&invitationId=inv_d057a3b1-21d6-4290-9aea-5eb1c556a8ef#
 *
 * @generated from message lekko.feature.v1beta1.Feature
 */
export class Feature extends Message<Feature> {
  /**
   * @generated from field: string key = 1;
   */
  key = ""

  /**
   * @generated from field: string description = 2;
   */
  description = ""

  /**
   * @generated from field: lekko.feature.v1beta1.Tree tree = 3;
   */
  tree?: Tree

  /**
   * @generated from field: lekko.feature.v1beta1.FeatureType type = 4;
   */
  type = FeatureType.UNSPECIFIED

  /**
   * @generated from field: google.protobuf.Struct metadata = 7;
   */
  metadata?: Struct

  constructor(data?: PartialMessage<Feature>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.feature.v1beta1.Feature"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: "description",
      kind: "scalar",
      T: 9 /* ScalarType.STRING */,
    },
    { no: 3, name: "tree", kind: "message", T: Tree },
    { no: 4, name: "type", kind: "enum", T: proto3.getEnumType(FeatureType) },
    { no: 7, name: "metadata", kind: "message", T: Struct },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Feature {
    return new Feature().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Feature {
    return new Feature().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Feature {
    return new Feature().fromJsonString(jsonString, options)
  }

  static equals(
    a: Feature | PlainMessage<Feature> | undefined,
    b: Feature | PlainMessage<Feature> | undefined,
  ): boolean {
    return proto3.util.equals(Feature, a, b)
  }
}

/**
 * When the rules evaluator is traversing the tree, it will keep a local variable
 * 'value' that is updated along the way and is finally returned. It is initially
 * set to the default value of the root node.
 *
 * @generated from message lekko.feature.v1beta1.Tree
 */
export class Tree extends Message<Tree> {
  /**
   * The default value to fall back to. If there are no constraints/rules
   * defined, this is what gets returned.
   *
   * @generated from field: google.protobuf.Any default = 1;
   */
  default?: Any$1

  /**
   * @generated from field: repeated lekko.feature.v1beta1.Constraint constraints = 2;
   */
  constraints: Constraint[] = []

  /**
   * @generated from field: lekko.feature.v1beta1.Any default_new = 3;
   */
  defaultNew?: Any

  /**
   * @generated from field: repeated string comments_before_return = 4;
   */
  commentsBeforeReturn: string[] = []

  constructor(data?: PartialMessage<Tree>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.feature.v1beta1.Tree"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "default", kind: "message", T: Any$1 },
    {
      no: 2,
      name: "constraints",
      kind: "message",
      T: Constraint,
      repeated: true,
    },
    { no: 3, name: "default_new", kind: "message", T: Any },
    {
      no: 4,
      name: "comments_before_return",
      kind: "scalar",
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Tree {
    return new Tree().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Tree {
    return new Tree().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Tree {
    return new Tree().fromJsonString(jsonString, options)
  }

  static equals(
    a: Tree | PlainMessage<Tree> | undefined,
    b: Tree | PlainMessage<Tree> | undefined,
  ): boolean {
    return proto3.util.equals(Tree, a, b)
  }
}

/**
 * This is basically an `if` statement
 *
 * @generated from message lekko.feature.v1beta1.Constraint
 */
export class Constraint extends Message<Constraint> {
  /**
   * RulesLang string. Purely for readability. All edits to ruleslang
   * are made through rule_ast_new instead.
   *
   * @generated from field: string rule = 1;
   */
  rule = ""

  /**
   * This can be empty. If non-empty, and the above rule evaluated to true,
   * then the rules engine should set its return value to this value.
   *
   * @generated from field: google.protobuf.Any value = 2;
   */
  value?: Any$1

  /**
   * If this list is empty, or none of the rules pass,
   * return the most recent concrete value we traversed.
   *
   * @generated from field: repeated lekko.feature.v1beta1.Constraint constraints = 3;
   */
  constraints: Constraint[] = []

  /**
   * Rules AST used for rules evaluation. It is a strict derivative of the
   * string rule above.
   * Deprecated: use rule_ast_new instead.
   *
   * @generated from field: lekko.rules.v1beta2.Rule rule_ast = 4 [deprecated = true];
   * @deprecated
   */
  ruleAst?: Rule

  /**
   * Rules AST used for rules evaluation. It is an n-ary tree.
   *
   * @generated from field: lekko.rules.v1beta3.Rule rule_ast_new = 5;
   */
  ruleAstNew?: Rule$1

  /**
   * @generated from field: lekko.feature.v1beta1.Any value_new = 6;
   */
  valueNew?: Any

  /**
   * @generated from field: repeated string comments_before_if = 7;
   */
  commentsBeforeIf: string[] = []

  /**
   * @generated from field: repeated string comments_before_return = 8;
   */
  commentsBeforeReturn: string[] = []

  constructor(data?: PartialMessage<Constraint>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.feature.v1beta1.Constraint"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "rule", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "value", kind: "message", T: Any$1 },
    {
      no: 3,
      name: "constraints",
      kind: "message",
      T: Constraint,
      repeated: true,
    },
    { no: 4, name: "rule_ast", kind: "message", T: Rule },
    { no: 5, name: "rule_ast_new", kind: "message", T: Rule$1 },
    { no: 6, name: "value_new", kind: "message", T: Any },
    {
      no: 7,
      name: "comments_before_if",
      kind: "scalar",
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
    {
      no: 8,
      name: "comments_before_return",
      kind: "scalar",
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Constraint {
    return new Constraint().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Constraint {
    return new Constraint().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Constraint {
    return new Constraint().fromJsonString(jsonString, options)
  }

  static equals(
    a: Constraint | PlainMessage<Constraint> | undefined,
    b: Constraint | PlainMessage<Constraint> | undefined,
  ): boolean {
    return proto3.util.equals(Constraint, a, b)
  }
}

/**
 * New custom any type which allows us to manage dynamic types and values
 * ourselves in application code.
 *
 * @generated from message lekko.feature.v1beta1.Any
 */
export class Any extends Message<Any> {
  /**
   * @generated from field: string type_url = 1;
   */
  typeUrl = ""

  /**
   * @generated from field: bytes value = 2;
   */
  value = new Uint8Array(0)

  constructor(data?: PartialMessage<Any>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = "lekko.feature.v1beta1.Any"
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "type_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Any {
    return new Any().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Any {
    return new Any().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Any {
    return new Any().fromJsonString(jsonString, options)
  }

  static equals(
    a: Any | PlainMessage<Any> | undefined,
    b: Any | PlainMessage<Any> | undefined,
  ): boolean {
    return proto3.util.equals(Any, a, b)
  }
}
