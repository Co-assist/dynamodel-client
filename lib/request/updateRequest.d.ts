import { UpdateInput, UpdateOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare class UpdateRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private returnValues?;
    private key;
    private attributes;
    private conditionExpression?;
    private updateExpression;
    private ModelConstructor;
    constructor(documentClient: DynamoDBDocumentClient, params: UpdateInput, stage: string);
    execute(): Promise<UpdateOutput>;
    private sendRequest;
    private buildExpressionContext;
    private isUpdateItemInput;
}
