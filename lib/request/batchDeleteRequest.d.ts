import { BatchDeleteInput, BatchDeleteOutput } from '../client';
export declare const BATCH_DELETE_LIMIT = 25;
export declare class BatchDeleteRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private keysList;
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: BatchDeleteInput, stage: string);
    execute(): Promise<BatchDeleteOutput>;
    private sendRequest;
}
