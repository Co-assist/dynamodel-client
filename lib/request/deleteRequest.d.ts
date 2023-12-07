import { DeleteInput, DeleteOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
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
    constructor(documentClient: DynamoDBDocumentClient, params: DeleteInput, stage: string);
    execute(): Promise<DeleteOutput>;
    private sendRequest;
    private buildExpressionContext;
}
