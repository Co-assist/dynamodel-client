import { QueryInput, QueryOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare class QueryRequest {
    private documentClient;
    private stage;
    private table;
    private consistentRead?;
    private countLimit;
    private exclusiveStartKey?;
    private indexName?;
    private pageSize;
    private returnConsumedCapacity?;
    private select?;
    private scanCountLimit;
    private scanIndexForward?;
    private attributes;
    private projectionExpression?;
    private filterExpression?;
    private keyConditionExpression?;
    constructor(documentClient: DynamoDBDocumentClient, params: QueryInput, stage: string);
    execute(): Promise<QueryOutput>;
    private sendRequest;
    private getLimit;
    private buildModelsFromResponses;
    private buildExpressionContext;
}
