import { BatchDeleteInput, BatchDeleteOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare const BATCH_DELETE_LIMIT = 25;
export declare class BatchDeleteRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private keysList;
    constructor(documentClient: DynamoDBDocumentClient, params: BatchDeleteInput, stage: string);
    execute(): Promise<BatchDeleteOutput>;
    private sendRequest;
}
