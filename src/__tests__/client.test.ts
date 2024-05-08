import {
  GetBoolValueRequest,
  GetBoolValueResponse,
  GetFloatValueRequest,
  GetFloatValueResponse,
  GetIntValueRequest,
  GetIntValueResponse,
  GetJSONValueRequest,
  GetJSONValueResponse,
  GetProtoValueRequest,
  GetProtoValueResponse,
  GetStringValueRequest,
  GetStringValueResponse,
  Any as LekkoAny,
} from "../gen/lekko/client/v1beta1/configuration_service_pb"
import {
  Any,
  BinaryWriter,
  BoolValue,
  FileDescriptorSet,
  protoBase64,
  WireType,
} from "@bufbuild/protobuf"
import { ClientContext } from "../context/context"
import { type TransportClient, initAPIClient } from "../index"
import { Store } from "../memory/store"
import { GetRepositoryContentsResponse } from "../gen/lekko/backend/v1beta1/distribution_service_pb"
import { Backend } from "../memory/backend"
import { ClientTransportBuilder } from "../transport-builder"

test("build API client", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  })
  expect(client).not.toEqual(undefined)
})

test("build API client with hostname", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    hostname: "http://testhostname.com",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  })
  expect(client).not.toEqual(undefined)
})

const SAMPLE_CONTEXT = new ClientContext()
SAMPLE_CONTEXT.setString("sample_key", "sample_value")

test("get bool config", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  }) as TransportClient
  const mockFn = jest.fn()
  Object.defineProperty(client.client, "getBoolValue", {
    value: mockFn,
    configurable: true,
    writable: true,
  })
  jest.spyOn(client.client, "getBoolValue").mockImplementation(async () =>
    GetBoolValueResponse.fromJson({
      value: true,
    }),
  )
  expect(await client.getBool("types", "bool", SAMPLE_CONTEXT)).toBe(true)
  expect(mockFn.mock.lastCall[0]).toEqual(
    GetBoolValueRequest.fromJson({
      key: "bool",
      context: {
        sample_key: {
          stringValue: "sample_value",
        },
      },
      namespace: "types",
      repoKey: {
        ownerName: "lekkodev",
        repoName: "config-test",
      },
    }),
  )
})

test("get int config", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  }) as TransportClient
  const mockFn = jest.fn()
  Object.defineProperty(client.client, "getIntValue", {
    value: mockFn,
    configurable: true,
    writable: true,
  })
  jest.spyOn(client.client, "getIntValue").mockImplementation(
    async () =>
      new GetIntValueResponse({
        value: BigInt(42),
      }),
  )
  expect(await client.getInt("types", "int", SAMPLE_CONTEXT)).toEqual(
    BigInt(42),
  )
  expect(mockFn.mock.lastCall[0]).toEqual(
    GetIntValueRequest.fromJson({
      key: "int",
      context: {
        sample_key: {
          stringValue: "sample_value",
        },
      },
      namespace: "types",
      repoKey: {
        ownerName: "lekkodev",
        repoName: "config-test",
      },
    }),
  )
})

test("get float config", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  }) as TransportClient
  const mockFn = jest.fn()
  Object.defineProperty(client.client, "getFloatValue", {
    value: mockFn,
    configurable: true,
    writable: true,
  })
  jest.spyOn(client.client, "getFloatValue").mockImplementation(async () =>
    GetFloatValueResponse.fromJson({
      value: 3.14,
    }),
  )
  expect(await client.getFloat("types", "float", SAMPLE_CONTEXT)).toBeCloseTo(
    3.14,
  )
  expect(mockFn.mock.lastCall[0]).toEqual(
    GetFloatValueRequest.fromJson({
      key: "float",
      context: {
        sample_key: {
          stringValue: "sample_value",
        },
      },
      namespace: "types",
      repoKey: {
        ownerName: "lekkodev",
        repoName: "config-test",
      },
    }),
  )
})

test("get json config", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  }) as TransportClient
  const mockedValue = {
    a: 1,
    b: {
      c: "foobar",
    },
  }
  const mockFn = jest.fn()
  Object.defineProperty(client.client, "getJSONValue", {
    value: mockFn,
    configurable: true,
    writable: true,
  })
  jest.spyOn(client.client, "getJSONValue").mockImplementation(async () =>
    GetJSONValueResponse.fromJson({
      value: Buffer.from(JSON.stringify(mockedValue)).toString("base64"),
    }),
  )
  expect(await client.getJSON("types", "json", SAMPLE_CONTEXT)).toEqual(
    mockedValue,
  )
  expect(mockFn.mock.lastCall[0]).toEqual(
    GetJSONValueRequest.fromJson({
      key: "json",
      context: {
        sample_key: {
          stringValue: "sample_value",
        },
      },
      namespace: "types",
      repoKey: {
        ownerName: "lekkodev",
        repoName: "config-test",
      },
    }),
  )
})

test("get string config", async () => {
  const client = initAPIClient({
    apiKey: "apiKey",
    repositoryOwner: "lekkodev",
    repositoryName: "config-test",
  }) as TransportClient
  const mockFn = jest.fn()
  Object.defineProperty(client.client, "getStringValue", {
    value: mockFn,
    configurable: true,
    writable: true,
  })
  jest.spyOn(client.client, "getStringValue").mockImplementation(async () =>
    GetStringValueResponse.fromJson({
      value: "foobar",
    }),
  )
  expect(await client.getString("types", "string", SAMPLE_CONTEXT)).toBe(
    "foobar",
  )
  expect(mockFn.mock.lastCall[0]).toEqual(
    GetStringValueRequest.fromJson({
      key: "string",
      context: {
        sample_key: {
          stringValue: "sample_value",
        },
      },
      namespace: "types",
      repoKey: {
        ownerName: "lekkodev",
        repoName: "config-test",
      },
    }),
  )
})

test("get proto config", async () => {
  const a = Any.pack(
    new BoolValue({
      value: true,
    }),
  )
  const testWithResponse = async (resp: GetProtoValueResponse) => {
    const client = initAPIClient({
      apiKey: "apiKey",
      repositoryOwner: "lekkodev",
      repositoryName: "config-test",
    }) as TransportClient
    const mockFn = jest.fn()
    Object.defineProperty(client.client, "getProtoValue", {
      value: mockFn,
      configurable: true,
      writable: true,
    })
    jest
      .spyOn(client.client, "getProtoValue")
      .mockImplementation(async () => resp)
    expect(await client.getProto("types", "proto", SAMPLE_CONTEXT)).toEqual(a)
    expect(mockFn.mock.lastCall[0]).toEqual(
      GetProtoValueRequest.fromJson({
        key: "proto",
        context: {
          sample_key: {
            stringValue: "sample_value",
          },
        },
        namespace: "types",
        repoKey: {
          ownerName: "lekkodev",
          repoName: "config-test",
        },
      }),
    )
  }

  // test backwards compatibility
  await testWithResponse(
    new GetProtoValueResponse({
      value: a,
    }),
  )

  // test dual-writing old and new any
  await testWithResponse(
    new GetProtoValueResponse({
      value: a,
      valueV2: new LekkoAny({
        ...a,
      }),
    }),
  )

  // test new any only
  await testWithResponse(
    new GetProtoValueResponse({
      valueV2: new LekkoAny({
        ...a,
      }),
    }),
  )
})

test("Test JFGI", () => {
  const file_descriptor_set = FileDescriptorSet.fromJson({"file":[{"name":"default/config/v1beta1/example.proto","package":"default.config.v1beta1","messageType":[{"name":"Foo","field":[{"name":"bar","number":1,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"bar"}]},{"name":"Dog","field":[{"name":"breed","number":1,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"breed"}]},{"name":"Context","field":[{"name":"breed","number":1,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"breed"},{"name":"repo","number":2,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"repo"},{"name":"env","number":3,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"env"},{"name":"rpc","number":4,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"rpc"},{"name":"team","number":5,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"team"},{"name":"username","number":6,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"username"},{"name":"teamname","number":7,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"teamname"},{"name":"feature","number":8,"label":"LABEL_OPTIONAL","type":"TYPE_STRING","jsonName":"feature"}]}],"enumType":[{"name":"DogBreed","value":[{"name":"DOG_BREED_UNSPECIFIED","number":0},{"name":"DOG_BREED_POMERANIAN","number":1},{"name":"DOG_BREED_GOLDEN_RETRIEVER","number":2},{"name":"DOG_BREED_POODLE","number":3},{"name":"DOG_BREED_MALTESE","number":4}]}],"sourceCodeInfo":{"location":[{"span":[0,0,29,1]},{"path":[12],"span":[0,0,18]},{"path":[2],"span":[2,0,31]},{"path":[4,0],"span":[4,0,6,1]},{"path":[4,0,1],"span":[4,8,11]},{"path":[4,0,2,0],"span":[5,4,19]},{"path":[4,0,2,0,5],"span":[5,4,10]},{"path":[4,0,2,0,1],"span":[5,11,14]},{"path":[4,0,2,0,3],"span":[5,17,18]},{"path":[5,0],"span":[8,0,14,1]},{"path":[5,0,1],"span":[8,5,13]},{"path":[5,0,2,0],"span":[9,4,30]},{"path":[5,0,2,0,1],"span":[9,4,25]},{"path":[5,0,2,0,2],"span":[9,28,29]},{"path":[5,0,2,1],"span":[10,4,29]},{"path":[5,0,2,1,1],"span":[10,4,24]},{"path":[5,0,2,1,2],"span":[10,27,28]},{"path":[5,0,2,2],"span":[11,4,35]},{"path":[5,0,2,2,1],"span":[11,4,30]},{"path":[5,0,2,2,2],"span":[11,33,34]},{"path":[5,0,2,3],"span":[12,4,25]},{"path":[5,0,2,3,1],"span":[12,4,20]},{"path":[5,0,2,3,2],"span":[12,23,24]},{"path":[5,0,2,4],"span":[13,4,26]},{"path":[5,0,2,4,1],"span":[13,4,21]},{"path":[5,0,2,4,2],"span":[13,24,25]},{"path":[4,1],"span":[16,0,18,1]},{"path":[4,1,1],"span":[16,8,11]},{"path":[4,1,2,0],"span":[17,4,21]},{"path":[4,1,2,0,5],"span":[17,4,10]},{"path":[4,1,2,0,1],"span":[17,11,16]},{"path":[4,1,2,0,3],"span":[17,19,20]},{"path":[4,2],"span":[20,0,29,1]},{"path":[4,2,1],"span":[20,8,15]},{"path":[4,2,2,0],"span":[21,8,25]},{"path":[4,2,2,0,5],"span":[21,8,14]},{"path":[4,2,2,0,1],"span":[21,15,20]},{"path":[4,2,2,0,3],"span":[21,23,24]},{"path":[4,2,2,1],"span":[22,8,24]},{"path":[4,2,2,1,5],"span":[22,8,14]},{"path":[4,2,2,1,1],"span":[22,15,19]},{"path":[4,2,2,1,3],"span":[22,22,23]},{"path":[4,2,2,2],"span":[23,8,23]},{"path":[4,2,2,2,5],"span":[23,8,14]},{"path":[4,2,2,2,1],"span":[23,15,18]},{"path":[4,2,2,2,3],"span":[23,21,22]},{"path":[4,2,2,3],"span":[24,8,23]},{"path":[4,2,2,3,5],"span":[24,8,14]},{"path":[4,2,2,3,1],"span":[24,15,18]},{"path":[4,2,2,3,3],"span":[24,21,22]},{"path":[4,2,2,4],"span":[25,8,24]},{"path":[4,2,2,4,5],"span":[25,8,14]},{"path":[4,2,2,4,1],"span":[25,15,19]},{"path":[4,2,2,4,3],"span":[25,22,23]},{"path":[4,2,2,5],"span":[26,8,28]},{"path":[4,2,2,5,5],"span":[26,8,14]},{"path":[4,2,2,5,1],"span":[26,15,23]},{"path":[4,2,2,5,3],"span":[26,26,27]},{"path":[4,2,2,6],"span":[27,8,28]},{"path":[4,2,2,6,5],"span":[27,8,14]},{"path":[4,2,2,6,1],"span":[27,15,23]},{"path":[4,2,2,6,3],"span":[27,26,27]},{"path":[4,2,2,7],"span":[28,8,27]},{"path":[4,2,2,7,5],"span":[28,8,14]},{"path":[4,2,2,7,1],"span":[28,15,22]},{"path":[4,2,2,7,3],"span":[28,25,26]}]},"syntax":"proto3"}]});
    const repoContentsResponse = GetRepositoryContentsResponse.fromJson({
      namespaces: [
        {
          name: "test-ns",
          features: [
            {
              name: "dog",
              feature: {
                key: "dog",
                tree: {
                  defaultNew: {
                    typeUrl: "type.googleapis.com/default.config.v1beta1.Dog",
                    value: protoBase64.enc(
                      new BinaryWriter()
                        .tag(1, WireType.LengthDelimited)
                        .string("Collie")
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
    });
    repoContentsResponse.fileDescriptorSet = file_descriptor_set;
  const store = new Store("", "")
  store.load(repoContentsResponse)
  const transport = new ClientTransportBuilder({
    hostname: "https://web.api.lekko.dev",
    apiKey: "",
  }).build()
  const client = new Backend(
    transport,
    "",
    "",
    "",
    store
  )
  const dog = client.get("test-ns", "dog") as {breed: string}
  expect(dog.breed).toEqual("Collie")
})
