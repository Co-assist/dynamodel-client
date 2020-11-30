import { UpdateInput, UpdateOutput } from '../dbClient';
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
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: UpdateInput, stage: string);
    execute(): Promise<UpdateOutput>;
    private sendRequest;
    private buildExpressionContext;
    private isUpdateItemInput;
}
