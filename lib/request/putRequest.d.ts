import { PutInput, PutOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare class PutRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private returnValues?;
    private attributes;
    private conditionExpression?;
    private ModelConstructor;
    private item;
    constructor(documentClient: DynamoDBDocumentClient, params: PutInput, stage: string);
    execute(): Promise<PutOutput>;
    private sendRequest;
    private buildExpressionContext;
}
