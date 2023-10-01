import {
    DistributionService,
} from '@buf/lekkodev_cli.bufbuild_connect-es/lekko/backend/v1beta1/distribution_service_connect';
import { FlagEvaluationEvent } from '@buf/lekkodev_cli.bufbuild_es/lekko/backend/v1beta1/distribution_service_pb';
import { RepositoryKey } from '@buf/lekkodev_sdk.bufbuild_es/lekko/client/v1beta1/configuration_service_pb';
import { PromiseClient, Transport, createPromiseClient } from '@bufbuild/connect';
import { Any, BoolValue, DoubleValue, Int64Value, StringValue, Timestamp, Value } from '@bufbuild/protobuf';
import { ClientContext } from '../context/context';
import { Client } from '../types/client';
import { EventsBatcher, toContextKeysProto } from './events';
import { Store, StoredEvalResult } from './store';

const eventsBatchSize = 100;

// An in-memory store that fetches configs from lekko's backend.
export class Backend implements Client {
    distClient: PromiseClient<typeof DistributionService>;
    store: Store;
    repoKey: RepositoryKey;
    sessionKey?: string;
    closed: boolean;
    updateIntervalMs?: number;
    timeout?: any;
    eventsBatcher: EventsBatcher;
    version: string;

    constructor(
        transport: Transport,
        repositoryOwner: string,
        repositoryName: string,
        version: string,
        updateIntervalMs?: number,
    ) {
        this.distClient = createPromiseClient(DistributionService, transport);
        this.store = new Store(repositoryOwner, repositoryName);
        this.repoKey = new RepositoryKey({
            ownerName: repositoryOwner,
            repoName: repositoryName
        });
        this.updateIntervalMs = updateIntervalMs;
        this.closed = false;
        this.version = version;
        this.eventsBatcher = new EventsBatcher(this.distClient, eventsBatchSize);
    }

    async getBool(namespace: string, key: string, ctx?: ClientContext): Promise<boolean> {
        const wrapper = new BoolValue();
        await this.evaluateAndUnpack(namespace, key, wrapper, ctx);
        return wrapper.value;
    }
    async getInt(namespace: string, key: string, ctx?: ClientContext): Promise<bigint> {
        const wrapper = new Int64Value();
        await this.evaluateAndUnpack(namespace, key, wrapper, ctx);
        return wrapper.value;
    }
    async getFloat(namespace: string, key: string, ctx?: ClientContext): Promise<number> {
        const wrapper = new DoubleValue();
        await this.evaluateAndUnpack(namespace, key, wrapper, ctx);
        return wrapper.value;
    }
    async getString(namespace: string, key: string, ctx?: ClientContext): Promise<string> {
        const wrapper = new StringValue();
        await this.evaluateAndUnpack(namespace, key, wrapper, ctx);
        return wrapper.value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getJSON(namespace: string, key: string, ctx?: ClientContext): Promise<any> {
        const wrapper = new Value();
        await this.evaluateAndUnpack(namespace, key, wrapper, ctx);
        return JSON.parse(wrapper.toJsonString());
    }
    async getProto(namespace: string, key: string, ctx?: ClientContext): Promise<Any> {
        const result = this.store.evaluateType(namespace, key, ctx);
        this.track(namespace, key, result, ctx);
        return result.evalResult.value;
    }

    async evaluateAndUnpack(
        namespace: string, 
        configKey: string,  
        wrapper: BoolValue | StringValue | Int64Value | DoubleValue | Value,
        ctx?: ClientContext,
    ) {
        const result = this.store.evaluateType(namespace, configKey, ctx);
        if (!result.evalResult.value.unpackTo(wrapper)) {
            throw new Error('type mismatch');
        }
        this.track(namespace, configKey, result, ctx);
    }

    track(namespace: string, key: string, result: StoredEvalResult, ctx?: ClientContext) {
        if (!this.eventsBatcher) {
            return;
        }
        this.eventsBatcher.track(new FlagEvaluationEvent({
            repoKey: this.repoKey,
            commitSha: result.commitSHA,
            featureSha: result.configSHA,
            namespaceName: namespace,
            featureName: key,
            contextKeys: toContextKeysProto(ctx),
            resultPath: result.evalResult.path,
            clientEventTime: Timestamp.now(),
        }));
    }    

    async initialize() {
        const registerResponse = await this.distClient.registerClient({
            repoKey: this.repoKey,
            sidecarVersion: this.version,
        })
        this.sessionKey = registerResponse.sessionKey;
        await this.updateStore();
        if (this.updateIntervalMs) {
            await this.loop();
        }
        await this.eventsBatcher.init(this.sessionKey);
    }

    async loop() {
        this.timeout = setTimeout(() => {
            if (this.closed) {
                return;
            }
            this.shouldUpdateStore()
                .then((should) => {
                    if (should) {
                        this.updateStore().finally(() => this.loop());
                    } else {
                        this.loop();
                    }
                }).catch(() => this.loop());
                
        }, this.updateIntervalMs);
    }

    async updateStore() {
        const contentsResponse = await this.distClient.getRepositoryContents({
            repoKey: this.repoKey,
            sessionKey: this.sessionKey
        })
        this.store.load(contentsResponse);
    }

    async shouldUpdateStore() {
        const versionResponse = await this.distClient.getRepositoryVersion({
            repoKey: this.repoKey,
            sessionKey: this.sessionKey
        });
        const currentSha = this.store.getCommitSHA();
        return currentSha != versionResponse.commitSha;
    }

    async close() {
        this.closed = true;
        if (this.timeout) {
            this.timeout.unref();
        }
        if (this.eventsBatcher) {
            await this.eventsBatcher.close();
        }
        await this.distClient.deregisterClient({
            sessionKey: this.sessionKey
        })
    }
}