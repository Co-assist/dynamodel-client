import { GetInput, GetOutput } from '../dbClient';
export declare class GetRequest {
    private documentClient;
    private stage;
    private table;
    private consistentRead?;
    private returnConsumedCapacity?;
    private attributes;
    private projectionExpression?;
    private key;
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: GetInput, stage: string);
    execute(): Promise<GetOutput>;
    private sendRequest;
    private buildExpressionContext;
}
