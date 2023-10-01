import {
    BoolValue,
    DoubleValue,
    Int64Value,
    Any,
    StringValue,
    Value,
    createRegistry
} from '@bufbuild/protobuf'
import {
    IEnumTypeRegistry,
    IMessageTypeRegistry,
    IServiceTypeRegistry
} from '@bufbuild/protobuf/dist/types/type-registry'

export type TypeRegistry = IMessageTypeRegistry & IEnumTypeRegistry & IServiceTypeRegistry

const registry = createRegistry(BoolValue, Int64Value, DoubleValue, StringValue, Value, Any)

const readOptions = { typeRegistry: registry, ignoreUnknownFields: true }

const writeOptions = { typeRegistry: registry }

// Read options for parsing protobuf messages that are internal to Lekko.
// ignoreUnknownFields: true allows our APIs between our FE and BE to
// be forwards compatible.
const internalReadOptions = { ignoreUnknownFields: true }

export { readOptions, writeOptions, internalReadOptions }

