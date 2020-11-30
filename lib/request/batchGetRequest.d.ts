import { BatchGetInput, BatchGetOutput } from '../dbClient';
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
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: BatchGetInput, stage: string);
    execute(): Promise<BatchGetOutput>;
    private sendRequest;
    private buildModelsFromResponses;
    private buildExpressionContext;
}
