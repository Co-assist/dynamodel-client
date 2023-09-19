import { BatchPutInput, BatchPutOutput } from '../client';
export declare const BATCH_PUT_LIMIT = 25;
export declare class BatchPutRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private itemsList;
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: BatchPutInput, stage: string);
    execute(): Promise<BatchPutOutput>;
    private sendRequest;
}
