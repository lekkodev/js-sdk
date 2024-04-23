import snakeCase from "lodash.snakecase"
import { Value } from "../gen/lekko/client/v1beta1/configuration_service_pb"

type ContextKey = string

class ClientContext {
  data: Record<ContextKey, Value>

  constructor() {
    this.data = {}
  }

  static fromJSON(
    jsonContext?: Record<string, string | number | boolean>,
  ): ClientContext {
    const ctx = new ClientContext()
    if (jsonContext === undefined) {
      return ctx
    }
    Object.entries(jsonContext).forEach(([k, v]) => {
      // For evaluation across languages, we proto-fy keys here
      // (alternatively, we could js-fy in eval logic)
      const casedK = snakeCase(k)
      switch (typeof v) {
        case "number": {
          // TODO: `1.0` is still integer in js :(
          if (Number.isInteger(v)) {
            ctx.setInt(casedK, v)
          } else {
            ctx.setDouble(casedK, v)
          }
          break
        }
        case "string": {
          ctx.setString(casedK, v)
          break
        }
        case "boolean": {
          ctx.setBoolean(casedK, v)
          break
        }
      }
    })
    return ctx
  }

  get(key: string): Value | undefined {
    return key in this.data ? this.data[key] : undefined
  }

  setBoolean(key: string, val: boolean): this {
    this.data[key] = Value.fromJson({
      boolValue: val,
    })
    return this
  }

  setInt(key: string, val: number): this {
    this.data[key] = Value.fromJson({
      intValue: val,
    })
    return this
  }

  setDouble(key: string, val: number): this {
    this.data[key] = Value.fromJson({
      doubleValue: val,
    })
    return this
  }

  setString(key: string, val: string): this {
    this.data[key] = Value.fromJson({
      stringValue: val,
    })
    return this
  }

  toString(): string {
    const pairs: string[] = []
    for (const k in this.data) {
      pairs.push(`${k}: ${this.data[k].kind.value}`)
    }
    return pairs.join(", ")
  }
}

export { ClientContext }
