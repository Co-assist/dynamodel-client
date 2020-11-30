import { PutInput, PutOutput } from '../dbClient';
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
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: PutInput, stage: string);
    execute(): Promise<PutOutput>;
    private sendRequest;
    private buildExpressionContext;
}
