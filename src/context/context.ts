import snakeCase from "lodash.snakecase"
import camelCase from "lodash.camelcase"
import { Value } from "../gen/lekko/client/v1beta1/configuration_service_pb"

export type ContextObject = Record<string, string | number | boolean>

class ClientContext {
  data: Record<string, Value>

  constructor() {
    this.data = {}
  }

  static fromObject(o?: ContextObject): ClientContext {
    const ctx = new ClientContext()
    if (o === undefined) {
      return ctx
    }
    Object.entries(o).forEach(([k, v]) => {
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

  /** @deprecated use fromObject */
  static fromJSON(jsonContext?: ContextObject): ClientContext {
    return this.fromObject(jsonContext)
  }

  toObject(): ContextObject {
    const context: ContextObject = {}
    Object.entries(this.data).forEach(([k, v]) => {
      const casedK = camelCase(k)
      switch (v.kind.case) {
        case "intValue": {
          context[casedK] = Number(v.kind.value) // TODO: proper conversion
          break
        }
        case "boolValue":
        case "stringValue":
        case "doubleValue": {
          context[casedK] = v.kind.value
        }
      }
    })
    return context
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
      const maybeQuote = this.data[k].kind.case === "stringValue" ? '"' : ""
      pairs.push(`${k}: ${maybeQuote}${this.data[k].kind.value}${maybeQuote}`)
    }
    return `{${pairs.join(", ")}}`
  }
}

export { ClientContext }
