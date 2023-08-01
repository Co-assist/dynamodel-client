import { BatchPutInput, BatchPutOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare const BATCH_PUT_LIMIT = 25;
export declare class BatchPutRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private itemsList;
    constructor(documentClient: DynamoDBDocumentClient, params: BatchPutInput, stage: string);
    execute(): Promise<BatchPutOutput>;
    private sendRequest;
}
