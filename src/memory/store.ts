import { GetRepositoryContentsResponse } from "../internal"
import { type Feature } from "../gen/lekko/feature/v1beta1/feature_pb"
import {
  Config,
  ListContentsResponse,
  Namespace,
} from "../gen/lekko/server/v1beta1/sdk_pb"
import { type ClientContext } from "../context/context"
import { type EvaluationResult, evaluate } from "../evaluation/eval"
import { Any } from "@bufbuild/protobuf"
import {
  createRegistryFromDescriptors,
  BinaryWriter,
  WireType,
  BinaryReader,
  type IMessageTypeRegistry,
} from "@bufbuild/protobuf"

export interface configData {
  configSHA: string
  config: Feature
}

export type configMap = Map<string, Map<string, configData>>

export class NotFoundError extends Error {
  constructor(resType: "namespace" | "config", name: string) {
    super(`${resType} ${name} not found`)
  }
}

export interface StoredEvalResult {
  config: Feature
  configSHA: string
  commitSHA: string
  evalResult: EvaluationResult
}

export class Store {
  public configs: configMap
  commitSHA: string
  ownerName: string
  repoName: string
  registry: IMessageTypeRegistry | undefined

  constructor(ownerName: string, repoName: string) {
    this.configs = new Map()
    this.commitSHA = ""
    this.ownerName = ownerName
    this.repoName = repoName
  }

  get(namespace: string, configKey: string) {
    const nsMap = this.configs.get(namespace)
    if (nsMap === undefined) {
      throw new NotFoundError("namespace", namespace)
    }
    const result = nsMap.get(configKey)
    if (result === undefined) {
      throw new NotFoundError("config", configKey)
    }
    return result
  }

  evaluateType(
    namespace: string,
    configKey: string,
    context?: ClientContext,
  ): StoredEvalResult {
    let fieldNumber
    let typeUrl
    while (true) {
      const cfg = this.get(namespace, configKey)
      const evalResult = evaluate(cfg.config, namespace, context)
      if (
        evalResult.value.typeUrl ===
        "type.googleapis.com/lekko.protobuf.ConfigCall"
      ) {
        const reader = new BinaryReader(evalResult.value.value)
        while (true) {
          try {
            const [fid, wireType] = reader.tag()
            switch (fid) {
              case 1:
                typeUrl = reader.string()
                break
              case 2:
                namespace = reader.string()
                break
              case 3:
                configKey = reader.string()
                break
              case 4:
                fieldNumber = reader.uint32()
                break
              default:
                reader.skip(wireType)
            }
          } catch (e) {
            break // there has to be a better way right?
          }
        }
      } else {
        if (fieldNumber !== undefined) {
          const reader = new BinaryReader(evalResult.value.value)
          while (true) {
            // TODO fucking default fields
            try {
              const [fid, wireType] = reader.tag()
              if (fid === fieldNumber) {
                const bytes =
                  wireType === WireType.LengthDelimited
                    ? reader.bytes()
                    : reader.skip(wireType)
                evalResult.value = new Any({
                  typeUrl,
                  value: new BinaryWriter()
                    .tag(1, WireType.LengthDelimited)
                    .bytes(bytes)
                    .finish(),
                })
                break
              } else {
                reader.skip(wireType)
              }
            } catch {
              break
            }
          }
        }
        return {
          ...cfg, // Why?... This is really slow and probably shouldn't be re-used... I also break this right now..
          commitSHA: this.getCommitSHA(),
          evalResult,
        }
      }
    }
  }

  getCommitSHA() {
    return this.commitSHA
  }

  load(contents: GetRepositoryContentsResponse | undefined) {
    if (contents === undefined) {
      return false
    }
    const newConfigs: configMap = new Map()
    contents.namespaces.forEach((ns) => {
      const nsMap = new Map<string, configData>()
      ns.features.forEach((cfg) => {
        if (cfg.feature !== undefined) {
          nsMap.set(cfg.name, {
            configSHA: cfg.sha,
            config: cfg.feature,
          })
        }
      })
      newConfigs.set(ns.name, nsMap)
    })
    this.configs = newConfigs
    this.commitSHA = contents.commitSha
    if (contents.fileDescriptorSet !== undefined) {
      this.registry = createRegistryFromDescriptors(contents.fileDescriptorSet)
    }
    return true
  }

  listContents(): ListContentsResponse {
    const resp = new ListContentsResponse({
      repoKey: {
        ownerName: this.ownerName,
        repoName: this.repoName,
      },
      commitSha: this.commitSHA,
    })
    this.configs.forEach((cfgMap, ns) => {
      const retNS = new Namespace({ name: ns })
      cfgMap.forEach((cfg, cfgName) => {
        retNS.configs.push(
          new Config({
            name: cfgName,
            sha: cfg.configSHA,
          }),
        )
      })
      resp.namespaces.push(retNS)
    })
    return resp
  }
}
