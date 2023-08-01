import { GetInput, GetOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare class GetRequest {
    private documentClient;
    private stage;
    private table;
    private consistentRead?;
    private returnConsumedCapacity?;
    private attributes;
    private projectionExpression?;
    private key;
    constructor(documentClient: DynamoDBDocumentClient, params: GetInput, stage: string);
    execute(): Promise<GetOutput>;
    private sendRequest;
    private buildExpressionContext;
}
