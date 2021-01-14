import { DeleteInput, DeleteOutput } from '../client';
export declare class DeleteRequest {
    private documentClient;
    private stage;
    private table;
    private returnConsumedCapacity?;
    private returnItemCollectionMetrics?;
    private returnValues?;
    private attributes;
    private conditionExpression?;
    private key;
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: DeleteInput, stage: string);
    execute(): Promise<DeleteOutput>;
    private sendRequest;
    private buildExpressionContext;
}
