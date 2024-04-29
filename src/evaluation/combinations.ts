import {
  type Any,
  BoolValue,
  DoubleValue,
  Int64Value,
  type Message,
  type MessageType,
  StringValue,
  Value,
} from "@bufbuild/protobuf"
import { type ClientContext } from "../context/context"
import {
  type Constraint,
  type Feature,
} from "../gen/lekko/feature/v1beta1/feature_pb"
import { evaluate, getValue } from "./eval"
import { type configData } from "../memory/store"
import {
  type CallExpression,
  ComparisonOperator,
  LogicalOperator,
  type Rule,
} from "../gen/lekko/rules/v1beta3/rules_pb"

export type JSONValue =
  | number
  | string
  | boolean
  | null
  | JSONObject
  | JSONValue[]
// Can't use Record here due to circular reference
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/consistent-indexed-object-style
export type JSONObject = {
  [key: string]: JSONValue
}

export interface JSONClientContext {
  data: JSONObject
}

export function getContextJSON(
  context: ClientContext | undefined,
): JSONClientContext | undefined {
  if (context === undefined) return context
  const json: JSONClientContext = {
    data: {},
  }
  Object.entries(context.data).forEach(([key, value]) => {
    const jsonValue = value.toJson()
    if (jsonValue !== null) {
      json.data[key] = jsonValue
    }
  })
  return json
}

export function is(a: Any, type: MessageType | string): boolean {
  if (a.typeUrl === "") {
    return false
  }
  const name = typeUrlToName(a.typeUrl)
  let typeName = ""
  if (typeof type === "string") {
    typeName = type
  } else {
    typeName = type.typeName
  }
  return name === typeName
}

function typeUrlToName(url: string): string {
  if (url.length === 0) {
    throw new Error(`invalid type url: ${url}`)
  }
  const slash = url.lastIndexOf("/")
  const name = slash > 0 ? url.substring(slash + 1) : url
  if (name.length === 0) {
    throw new Error(`invalid type url: ${url}`)
  }
  return name
}

export function unpackTo(a: Any, m: Message): boolean {
  if (!is(a, m.getType())) {
    return false
  }
  m.fromBinary(a.value)
  return true
}

export function getSimpleValue(value: Any): Result {
  if (is(value, BoolValue)) {
    const bv = new BoolValue()
    unpackTo(value, bv)
    return bv.value
  } else if (is(value, Int64Value)) {
    const iv = new Int64Value()
    unpackTo(value, iv)
    return Number(iv.value)
  } else if (is(value, DoubleValue)) {
    const dv = new DoubleValue()
    unpackTo(value, dv)
    return Number(dv.value)
  } else if (is(value, StringValue)) {
    const str = new StringValue()
    unpackTo(value, str)
    return str.value
  } else if (is(value, Value)) {
    const v = new Value()
    unpackTo(value, v)
    return v.toJsonString()
  }

  return ""
}

export function getConstraintValue(constraint: Constraint) {
  const value = getValue(constraint.value, constraint.valueNew)

  return getSimpleValue(value)
}

type Result = string | number | boolean

interface ResultSetRaw {
  result: Result
  constraints: Constraint[]
  default: boolean
}

interface ResultSet {
  result: Result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialized: any
  default: boolean
}

function serializeResultSet(resultSetRaw: ResultSetRaw): ResultSet {
  const serialized = resultSetRaw.constraints.flatMap((constraint) =>
    constraint.ruleAstNew === undefined
      ? []
      : [serializeRule(constraint.ruleAstNew)],
  )

  return {
    result: resultSetRaw.result,
    serialized,
    default: resultSetRaw.default,
  }
}

export function getConfigCombinations(config: Feature) {
  const combinations: ResultSetRaw[] = []

  if (config.tree === undefined) return []
  const constraints = config.tree.constraints ?? []

  // if there is only a default it cannot generate combinations against other features
  if (constraints.length === 0) {
    return []
  }

  combinations.push({
    result: getSimpleValue(
      getValue(config.tree.default, config.tree.defaultNew),
    ),
    constraints: [],
    default: true,
  })

  constraints.forEach((constraint) => {
    const result = getConstraintValue(constraint)
    const existingResultSet = combinations.find(
      (combination) => combination.result === result,
    )
    if (existingResultSet !== undefined) {
      existingResultSet.constraints.push(constraint)
    } else {
      combinations.push({
        result,
        constraints: [constraint],
        default: false,
      })
    }
  })

  return combinations.map(serializeResultSet)
}

export interface ConfigCombination {
  configName: string
  value: ResultSet
}

export interface Grouping {
  configResults: Record<string, ResultSet>
  evaluatedContextPercentage: number
  exampleContext?: JSONClientContext
}

function convertToRecord(
  combinations: ConfigCombination[],
): Record<string, ResultSet> {
  return combinations.reduce<Record<string, ResultSet>>((acc, combination) => {
    acc[combination.configName] = combination.value
    return acc
  }, {})
}

export function getNamespaceCombinations(
  configs: Map<string, configData>,
  excludedConfigNames: string[],
  contextSamples?: ClientContext[],
): Grouping[] {
  const allConfigs: Array<{ configName: string; values: ResultSet[] }> =
    Array.from(configs.entries())
      .map(([configName, configData]) => ({
        configName,
        values: getConfigCombinations(configData.config),
      }))
      .filter(
        (config) =>
          config.values.length > 0 &&
          !excludedConfigNames.includes(config.configName),
      )

  if (allConfigs.length === 0) {
    return []
  }

  const cartesianProduct = (
    arr: Array<{ configName: string; values: ResultSet[] }>,
    result: ConfigCombination[][],
    index: number = 0,
    current: ConfigCombination[] = [],
  ): ConfigCombination[][] => {
    if (index === arr.length) {
      result.push(current.slice())
      return result
    }
    arr[index].values.forEach((value) => {
      current[index] = { configName: arr[index].configName, value }
      cartesianProduct(arr, result, index + 1, current)
    })
    return result
  }

  const product = cartesianProduct(allConfigs, [], 0, [])
  const mapped = product.map((combinations) => convertToRecord(combinations))

  const remainingConfigs: Feature[] = []
  const remainingConfigNames = Object.keys(mapped[0] ?? {})
  configs.forEach((configData, configName) => {
    if (
      remainingConfigNames.includes(configName) &&
      !excludedConfigNames.includes(configName)
    ) {
      remainingConfigs.push(configData.config)
    }
  })
  return evaluateAndGroupConfigurations(
    remainingConfigs,
    mapped,
    contextSamples,
  )
}

// result sets are not serializable because of the constraints
function getCombinationKey(combination: Record<string, ResultSet>): string {
  const resultOnlyRecord: Record<string, Result> = {}

  for (const [key, resultSet] of Object.entries(combination)) {
    resultOnlyRecord[key] = resultSet.result
  }

  return JSON.stringify(resultOnlyRecord)
}

export function evaluateAndGroupConfigurations(
  configs: Feature[],
  initialResults: Array<Record<string, ResultSet>>,
  contextSamples: ClientContext[] = [],
): Grouping[] {
  const groupingsMap = new Map<string, Grouping>()

  initialResults.forEach((result) => {
    const resultKey = getCombinationKey(result)
    groupingsMap.set(resultKey, {
      configResults: result,
      evaluatedContextPercentage: 0,
    })
  })

  contextSamples.forEach((context) => {
    const results: Record<string, Result> = {}
    configs.forEach((config) => {
      const evaluationResult = evaluate(config, "frontend", context)
      const simpleResult = getSimpleValue(evaluationResult.value)
      results[config.key] = simpleResult
    })

    const resultsKey = JSON.stringify(results)
    const grouping = groupingsMap.get(resultsKey)
    if (grouping !== undefined) {
      grouping.exampleContext = getContextJSON(context)
      grouping.evaluatedContextPercentage += (1.0 / contextSamples.length) * 100
    }
  })

  return Array.from(groupingsMap.values())
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeRule(rule: Rule): any {
  switch (rule.rule.case) {
    case "atom":
      return {
        type: "Atom",
        contextKey: rule.rule.value.contextKey,
        operator: ComparisonOperator[rule.rule.value.comparisonOperator],
        value: rule.rule.value.comparisonValue?.toString() ?? "undefined",
      }
    case "not":
      return {
        type: "Not",
        rule: serializeRule(rule.rule.value),
      }
    case "logicalExpression":
      return {
        type: "LogicalExpression",
        operator: LogicalOperator[rule.rule.value.logicalOperator],
        rules: rule.rule.value.rules.map(serializeRule),
      }
    case "boolConst":
      return {
        type: "Boolean",
        value: rule.rule.value,
      }
    case "callExpression":
      return serializeCallExpression(rule.rule.value)
    default:
      return { error: "Unknown Rule Type" }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeCallExpression(callExpr: CallExpression): any {
  switch (callExpr.function.case) {
    case "bucket":
      return {
        type: "Bucket",
        contextKey: callExpr.function.value.contextKey,
        threshold: callExpr.function.value.threshold,
      }
    case "evaluateTo":
      return {
        type: "EvaluateTo",
        configName: callExpr.function.value.configName,
        configValue:
          callExpr.function.value.configValue?.toString() ?? "undefined",
      }
    default:
      return { error: "Unknown Function Type" }
  }
}
