import { Any, BoolValue, DoubleValue, Int64Value, Message, MessageType, StringValue, Value } from "@bufbuild/protobuf";
import { ClientContext } from "../context/context"
import { Constraint, Feature,  Any as LekkoAny } from "../gen/lekko/feature/v1beta1/feature_pb";
import { Rule } from "../gen/lekko/rules/v1beta3/rules_pb";
import { evaluate, getValue } from "./eval";
import evaluateRule, { getNumber, getString } from "./rule";
import { configMap } from "..";
import { configData } from "../memory/store";

interface ContextInfo {
    contextKey: string;
    possibleValues: any[];
  }
  
  function extractContextInfo(rule: Rule): ContextInfo[] {
    const contextInfos: ContextInfo[] = [];
    
    function traverseRule(rule: Rule) {
        console.log(rule.rule.case)

      switch (rule.rule.case) {
        case "atom": {
            console.log(rule.rule.value.contextKey)
          contextInfos.push({
            contextKey: rule.rule.value.contextKey,
            possibleValues: [rule.rule.value.comparisonValue]
          });
          break;
        }
        case "logicalExpression":
          rule.rule.value.rules.forEach(traverseRule);
          break;
        case "not":
          traverseRule(rule.rule.value);
          break;
      }
    }
  
    traverseRule(rule);
    console.log('context infos')
    console.log(contextInfos)
    return contextInfos;
  }
  
  function generateCombinations(contextInfos: ContextInfo[]): ClientContext[] {
    const allCombinations: ClientContext[] = [];

    function generate(currentIndex: number, currentContext: ClientContext) {
        console.log(`At index ${currentIndex}, current context data:`, JSON.stringify(currentContext.data));

        if (currentIndex === contextInfos.length) {
            allCombinations.push(currentContext);
            console.log('Pushing final context:', JSON.stringify(currentContext.data));
            return;
        }

        const info = contextInfos[currentIndex];
        info.possibleValues.forEach(value => {
            const newContext = new ClientContext();  // Create a new context for each combination
            // Copy all previous context settings to the new context
            Object.entries(currentContext.data).forEach(([key, val]) => {
                console.log(`Copying key: ${key}, value:`, val);
                switch (val.kind.case) {
                    case 'stringValue':
                        newContext.setString(key, getString(val));
                        break;
                    case 'doubleValue':
                    case 'intValue':
                        newContext.setDouble(key, getNumber(val));
                        break;
                    case 'boolValue':
                        newContext.setBoolean(key, val.kind.value);
                        break;
                }
            });

            // Add the current value in the correct type
            console.log(`Adding new value for key '${info.contextKey}' of type ${typeof value}:`, value);
            switch (value.kind.case) {
                case 'stringValue':
                    newContext.setString(info.contextKey, getString(value));
                    break;
                case 'doubleValue':
                    newContext.setDouble(info.contextKey, getNumber(value));
                    break;
                case 'intValue':
                    newContext.setInt(info.contextKey, getNumber(value));
                    break;
                case 'boolValue':
                    newContext.setBoolean(info.contextKey, value.kind.value);
                    break;
                default:
                    console.log('no match')
            }
            generate(currentIndex + 1, newContext);
        });
    }

    generate(0, new ClientContext());
    console.log('finished with this step')
    console.log(allCombinations)
    return allCombinations;
}

  function evaluateWithAllCombinations(
    rule: Rule,
    combinations: ClientContext[]
  ): boolean[] {
    return combinations.map(context => evaluateRule(rule, "namespace", "configName", context));
  }
  
  export function evaluateConfigConstraints(config: Feature): void {
    console.log('printing config')
    console.log(config.toJsonString())
    const constraints = config.tree?.constraints ?? [];
  
    constraints.forEach((constraint, index) => {
      console.log(`Evaluating constraint ${index + 1}/${constraints.length}`);
      if (constraint.ruleAstNew) {
        const rule = constraint.ruleAstNew;  // Assuming each constraint has a 'ruleAstNew'
        const contextInfos = extractContextInfo(rule);
        const combinations = generateCombinations(contextInfos);
        console.log('have all combinations')
        console.log(combinations)
  
        combinations.forEach((context, comboIndex) => {
          const contextDescription = Object.entries(context.data).map(([key, value]) => `${key}: ${value}`).join(', ');
          const result = evaluateRule(rule, "frontend", config.key, context);
          
          console.log(`Combination ${comboIndex + 1}: {${contextDescription}} - Result: ${result}`);
        });
  
      } else {
        console.error(`No rule found for constraint ${index + 1}`);
      }
    });
  }
  
  function combineContexts(contextsArray: ClientContext[][]): ClientContext[] {
    const combinedContexts = new Map<string, any>();
  
    // Combine all contexts into a single map to deduplicate
    contextsArray.forEach(contexts => {
        contexts.forEach(context => {
            Object.entries(context.data).forEach(([key, value]) => {
                // Assuming merging strategy is simply to take unique, or replace
                combinedContexts.set(key, value);
            });
        });
    });
  
    // Convert the map back to an array of ClientContext instances
    const resultContexts: ClientContext[] = [];
    const keys = Array.from(combinedContexts.keys());
    // Generate all combinations of the values from the keys
    // This step might need a recursive combination function based on unique keys
    // Placeholder for conversion logic
    return resultContexts;
  }

  export function is(a: Any, type: MessageType | string): boolean {
    if (a.typeUrl === '') {
        return false
    }
    const name = typeUrlToName(a.typeUrl)
    let typeName = ''
    if (typeof type === 'string') {
        typeName = type
    } else {
        typeName = type.typeName
    }
    return name === typeName
}

function typeUrlToName(url: string): string {
    if (!url.length) {
        throw new Error(`invalid type url: ${url}`)
    }
    const slash = url.lastIndexOf('/')
    const name = slash > 0 ? url.substring(slash + 1) : url
    if (!name.length) {
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


  function toString(a: Any) {
    if (is(a, BoolValue)) {
        const bv = new BoolValue()
        unpackTo(a, bv)
        return String(bv.value)
    } else if (is(a, Int64Value)) {
        const iv = new Int64Value()
        unpackTo(a, iv)
        return String(iv.value)
    } else if (is(a, DoubleValue)) {
        const dv = new DoubleValue()
        unpackTo(a, dv)
        return String(dv.value)
    } else if (is(a, StringValue)) {
        const sv = new StringValue()
        unpackTo(a, sv)
        return sv.value
    } else if (is(a, Value)) {
        const v = new Value()
        unpackTo(a, v)
        return v.toJsonString()
    } else {
        return "proto value"
    }
  }

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
  
  export function evaluateCombinations(feature: Feature) {
    const serializable: any[] = []
    const allContextCombinations: ClientContext[][] = [[new ClientContext()]];
  
    feature.tree?.constraints.forEach((constraint) => {
        if (constraint.ruleAstNew) {
            const rule = constraint.ruleAstNew;
            const contextInfos = extractContextInfo(rule);
            const combinations = generateCombinations(contextInfos);
            console.log('have all combinations')
            console.log(combinations)
            allContextCombinations.push(combinations);
        }
    });

    console.log('finished aggregating')
    console.log(allContextCombinations)
  
    //const uniqueContextCombinations = combineContexts(allContextCombinations);
  
    allContextCombinations.forEach((contextCombinations, constraintIndex) => {
      contextCombinations.forEach((context, index) => {
        const evalResult = evaluate(feature, "frontend", context);
        console.log(context.data)
        //const contextDescription = Object.entries(context.data).map(([key, val]) => `${key}: ${val}`).join(', ');
        const contextDescription = JSON.stringify(getContextJSON(context))

        serializable.push({
            context: getContextJSON(context),
            result: toString(evalResult.value)
        })
        
        console.log(`Combination ${constraintIndex + 1} - ${index + 1}: {${contextDescription}} - Result: ${toString(evalResult.value)}`);
      });
    })
  
    return serializable
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

    return ''
}

  export function getConstraintValue(constraint: Constraint) {
    const value = getValue(constraint.value, constraint.valueNew)
    
    return getSimpleValue(value)
  }


  export function getConfigCombinations(config: Feature) {
    const combinationsSet = new Set<Result>();  
  
    if (config.tree === undefined) return [];  
    const constraints = config.tree.constraints ?? [];
  
    // if there is only a default it cannot generate combinations against other features
    if (constraints.length === 0) {
      return []; 
    }
  
    combinationsSet.add(getSimpleValue(getValue(config.tree.default, config.tree.defaultNew)));
  
    constraints.forEach((constraint) => {
      combinationsSet.add(getConstraintValue(constraint));
    });
  
    return [...combinationsSet];  
  }
  
  type Result = string | number | boolean

export interface ConfigCombination {
    configName: string;
    value: Result
}

export interface Grouping {
    configResults: Record<string, Result>
    evaluatedContextPercentage: number
}

function convertToRecord(combinations: ConfigCombination[]): Record<string, Result> {
    return combinations.reduce((acc, combination) => {
        acc[combination.configName] = combination.value;
        return acc;
    }, {} as Record<string, Result>);
}

export function getNamespaceCombinations(configs: Map<string, configData>, excludedConfigNames: string[], contextSamples?: ClientContext[]): Record<string, Result>[] {
    const allConfigs: { configName: string; values: Result[] }[] = Array.from(configs.entries())
      .map(([configName, configData]) => ({
          configName,
          values: getConfigCombinations(configData.config)
      }))
      .filter(config => config.values.length > 0 && !excludedConfigNames.includes(config.configName))

    if (allConfigs.length === 0) {
        return []; 
    }

    // Generate the Cartesian product of these combinations
    const cartesianProduct = (
        arr: { configName: string; values: Result[] }[],
        result: ConfigCombination[][],
        index: number = 0,
        current: ConfigCombination[] = []
    ): ConfigCombination[][] => {
        if (index === arr.length) {
            result.push(current.slice());
            return result;
        }
        arr[index].values.forEach(value => {
            current[index] = { configName: arr[index].configName, value };
            cartesianProduct(arr, result, index + 1, current);
        });
        return result;
    };

    const product = cartesianProduct(allConfigs, [], 0, []);
    const mapped = product.map(combinations => convertToRecord(combinations))

    return mapped
}
