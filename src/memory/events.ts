import { DistributionService } from "../gen/lekko/backend/v1beta1/distribution_service_connect";
import { ContextKey, FlagEvaluationEvent, SendFlagEvaluationMetricsRequest } from "../gen/lekko/backend/v1beta1/distribution_service_pb";
import { Value } from "../gen/lekko/client/v1beta1/configuration_service_pb";
import { PromiseClient } from "@connectrpc/connect";
import { BackoffOptions } from 'exponential-backoff';
import { ClientContext } from "../context/context";

export class EventsBatcher {
    private distClient: PromiseClient<typeof DistributionService>;
    private sessionKey?: string;
    private batch: FlagEvaluationEvent[];
    private batchSize: number;
    private interval?: number; // setInterval returns a number in the browser environment
    private sendPromise?: Promise<void>;

    constructor(distClient: PromiseClient<typeof DistributionService>, batchSize: number) {
        this.distClient = distClient;
        this.batch = [];
        this.batchSize = batchSize;
    }

    init(sessionKey: string): void {
        this.sessionKey = sessionKey;
        this.interval = window.setInterval(() => {
            this.sendBatch();
        }, 15000); // 15 seconds
    }

    track(event: FlagEvaluationEvent): void {
        this.batch.push(event);
        if (this.batch.length >= this.batchSize) {
            this.sendBatch();
        }
    }

    async sendBatch(): Promise<void> {
        if (this.batch.length === 0) {
            return;
        }
        if (this.sendPromise) {
            await this.sendPromise;
        }

        const events = this.batch;
        this.batch = [];
        this.sendPromise = this.sendMetrics(events).finally(() => {
            this.sendPromise = undefined;
        });
    }

    private async sendMetrics(events: FlagEvaluationEvent[]): Promise<void> {
        try {
            await this.distClient.sendFlagEvaluationMetrics(new SendFlagEvaluationMetricsRequest({
                events,
                sessionKey: this.sessionKey
            }))
        } catch (e) {
            console.error(`Failed to send metrics batch: ${e}`);
            this.batch.unshift(...events);
        }
    }

    async close(): Promise<void> {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
        if (this.sendPromise) {
            await this.sendPromise;
        }
        await this.sendBatch();
    }
}

export function toContextKeysProto(context?: ClientContext) : ContextKey[] {
    const result: ContextKey[] = [];
    if (!context) {
        return result;
    }
    for (const key in context.data) {
        result.push(new ContextKey({
            key,
            type: lekkoValueToType(context.get(key)),
        }));
    }
    return result;
}

function lekkoValueToType(val : Value | undefined) : string {
    if (!val) {
        return '';
    }
    switch (val.kind.case) {
        case 'boolValue': return 'bool';
        case 'doubleValue': return 'float';
        case 'intValue': return 'int';
        case 'stringValue': return 'string';
    }
    return '';
}


