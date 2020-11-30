import { ScanInput, ScanOutput } from '../dbClient';
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
    constructor(documentClient: AWS.DynamoDB.DocumentClient, params: ScanInput, stage: string);
    execute(): Promise<ScanOutput>;
    private sendRequest;
    private getLimit;
    private buildModelsFromResponses;
    private buildExpressionContext;
}
