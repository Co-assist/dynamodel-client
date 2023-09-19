import { BatchGetInput, BatchGetOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare const BATCH_GET_LIMIT = 25;
export declare class BatchGetRequest {
    private documentClient;
    private stage;
    private table;
    private consistentRead?;
    private returnConsumedCapacity?;
    private keysList;
    private projectionExpression?;
    private attributes;
    constructor(documentClient: DynamoDBDocumentClient, params: BatchGetInput, stage: string);
    execute(): Promise<BatchGetOutput>;
    private sendRequest;
    private buildModelsFromResponses;
    private buildExpressionContext;
}
