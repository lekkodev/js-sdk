import {
  StringValue,
  BinaryWriter,
  WireType,
  protoBase64,
} from "@bufbuild/protobuf"
import { Store } from "../memory/store"
import { GetRepositoryContentsResponse } from "../gen/lekko/backend/v1beta1/distribution_service_pb"

test("Super Basic Test", () => {
  const store = new Store("", "")
  store.load(
    GetRepositoryContentsResponse.fromJson({
      namespaces: [
        {
          name: "test-ns",
          features: [
            {
              name: "active-model",
              feature: {
                key: "active-model",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/google.protobuf.StringValue",
                    value: "CgRHUFQ0",
                  },
                },
                type: "FEATURE_TYPE_STRING",
              },
            },
          ],
        },
      ],
    }),
  )

  const wrapper = new StringValue()
  const d = store.evaluateType("test-ns", "active-model")
  d.evalResult.value.unpackTo(wrapper)
  expect(wrapper.value).toEqual("GPT4")
})

test("Direct Reference", () => {
  const store = new Store("", "")
  store.load(
    GetRepositoryContentsResponse.fromJson({
      namespaces: [
        {
          name: "test-ns",
          features: [
            {
              name: "parent",
              feature: {
                key: "child",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/lekko.protobuf.ConfigCall",
                    value: protoBase64.enc(
                      new BinaryWriter()
                        .tag(1, WireType.LengthDelimited)
                        .string(
                          "type.googleapis.com/google.protobuf.StringValue",
                        )
                        .tag(2, WireType.LengthDelimited)
                        .string("test-ns")
                        .tag(3, WireType.LengthDelimited)
                        .string("child")
                        .finish(),
                    ),
                  },
                },
                type: "FEATURE_TYPE_STRING",
              },
            },
            {
              name: "child",
              feature: {
                key: "child",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/google.protobuf.StringValue",
                    value: "CgRHUFQ0",
                  },
                },
                type: "FEATURE_TYPE_STRING",
              },
            },
          ],
        },
      ],
    }),
  )

  const wrapper = new StringValue()
  const d = store.evaluateType("test-ns", "parent")
  d.evalResult.value.unpackTo(wrapper)
  expect(wrapper.value).toEqual("GPT4")
})

test("Call With Field", () => {
  const store = new Store("", "")
  store.load(
    GetRepositoryContentsResponse.fromJson({
      namespaces: [
        {
          name: "test-ns",
          features: [
            {
              name: "parent",
              feature: {
                key: "child",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/lekko.protobuf.ConfigCall",
                    value: protoBase64.enc(
                      new BinaryWriter()
                        .tag(1, WireType.LengthDelimited)
                        .string(
                          "type.googleapis.com/google.protobuf.StringValue",
                        )
                        .tag(2, WireType.LengthDelimited)
                        .string("test-ns")
                        .tag(3, WireType.LengthDelimited)
                        .string("child")
                        .tag(4, WireType.Varint)
                        .uint32(2)
                        .finish(),
                    ),
                  },
                },
                type: "FEATURE_TYPE_STRING",
              },
            },
            {
              name: "child",
              feature: {
                key: "child",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/lekko.default.FancyConfig",
                    value: protoBase64.enc(
                      new BinaryWriter()
                        .tag(1, WireType.LengthDelimited)
                        .string("fdsafdsa")
                        .tag(2, WireType.LengthDelimited)
                        .string("GPT4")
                        .tag(6, WireType.Varint)
                        .uint32(2)
                        .finish(),
                    ),
                  },
                },
                type: "FEATURE_TYPE_STRING",
              },
            },
          ],
        },
      ],
    }),
  )

  const wrapper = new StringValue()
  const d = store.evaluateType("test-ns", "parent")
  d.evalResult.value.unpackTo(wrapper)
  expect(wrapper.value).toEqual("GPT4")
})
