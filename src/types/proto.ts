import { type Message } from "@bufbuild/protobuf"

const WELL_KNOWN_PRIMITIVE_TYPE_NAMES: Record<string, boolean> = {
  "google.protobuf.BoolValue": true,
  "google.protobuf.StringValue": true,
  "google.protobuf.Int64Value": true,
  "google.protobuf.DoubleValue": true,
}

export interface WellKnownPrimitive extends Message {
  value: unknown
}

export function isWellKnownPrimitive(
  message: Message,
): message is WellKnownPrimitive {
  return WELL_KNOWN_PRIMITIVE_TYPE_NAMES[message.getType().typeName]
}
