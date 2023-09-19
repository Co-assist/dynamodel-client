import { ScanInput, ScanOutput } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare class ScanRequest {
    private documentClient;
    private stage;
    private table;
    private consistentRead?;
    private countLimit;
    private exclusiveStartKey?;
    private indexName?;
    private pageSize;
    private returnConsumedCapacity?;
    private segment?;
    private totalSegments?;
    private select?;
    private scanCountLimit;
    private attributes;
    private projectionExpression?;
    private filterExpression?;
    constructor(documentClient: DynamoDBDocumentClient, params: ScanInput, stage: string);
    execute(): Promise<ScanOutput>;
    private sendRequest;
    private getLimit;
    private buildModelsFromResponses;
    private buildExpressionContext;
}
