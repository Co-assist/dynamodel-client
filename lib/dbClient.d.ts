import { Updatable } from './expression/updateExpression';
import { Projection } from './expression/projectionExpression';
import { ConditionExpression } from './expression/conditionExpression';
import { Table } from './table';
import { Model } from './model';
export declare class DynamoModel {
    private documentClient;
    private stage;
    constructor(documentClient: AWS.DynamoDB.DocumentClient, stage: string);
    batchDelete(params: BatchDeleteInput): Promise<BatchDeleteOutput>;
    batchGet(params: BatchGetInput): Promise<BatchGetOutput>;
    batchPut(params: BatchPutInput): Promise<BatchPutOutput>;
    delete(params: DeleteInput): Promise<DeleteOutput>;
    get(params: GetInput): Promise<GetOutput>;
    put(params: PutInput): Promise<PutOutput>;
    query(params: QueryInput): Promise<QueryOutput>;
    scan(params: ScanInput): Promise<ScanOutput>;
    update(params: UpdateInput): Promise<UpdateOutput>;
}
export interface BatchDeleteInput {
    keys: AttributeMap[];
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
}
export interface BatchDeleteOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    itemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ItemCollectionMetrics[];
    responses: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput[];
    unprocessedKeys: AttributeMap;
}
export interface BatchGetInput {
    consistentRead?: boolean;
    keys: AttributeMap[];
    projection?: Projection;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    table: Table;
}
export interface BatchGetOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    models: Model[];
    responses: AWS.DynamoDB.DocumentClient.BatchGetItemOutput[];
    unprocessedKeys: AttributeMap;
}
export interface BatchPutInput {
    items: AttributeMap[];
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
}
export interface BatchPutOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    itemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ItemCollectionMetrics[];
    responses: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput[];
    unprocessedItems: AttributeMap;
}
export interface DeleteInput {
    condition?: ConditionExpression;
    key: AttributeMap;
    returnValues?: DeleteReturnValues;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
}
export interface DeleteOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    itemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ItemCollectionMetrics;
    model?: Model;
    response: AWS.DynamoDB.DocumentClient.DeleteItemOutput;
}
export interface GetInput {
    key: AttributeMap;
    consistentRead?: boolean;
    projection?: Projection;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    table: Table;
}
export interface GetOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    model?: Model;
    response: AWS.DynamoDB.DocumentClient.GetItemOutput;
}
export interface PutInput {
    condition?: ConditionExpression;
    item: AttributeMap;
    returnValues?: PutReturnValues;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
}
export interface PutOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    itemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ItemCollectionMetrics;
    model?: Model;
    response: AWS.DynamoDB.DocumentClient.PutItemOutput;
}
export interface QueryInput {
    consistentRead?: boolean;
    countLimit?: number;
    exclusiveStartKey?: AttributeMap;
    filter?: ConditionExpression;
    indexName?: string;
    keyCondition?: ConditionExpression;
    pageSize?: number;
    projection?: Projection;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    scanIndexForward?: boolean;
    scanCountLimit?: number;
    select?: Select;
    table: Table;
}
export interface QueryOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    count: number;
    models: Model[];
    lastEvaluatedKey?: AttributeMap;
    responses: AWS.DynamoDB.DocumentClient.QueryOutput[];
    scannedCount: number;
}
export interface ScanInput {
    consistentRead?: boolean;
    countLimit?: number;
    exclusiveStartKey?: AttributeMap;
    filter?: ConditionExpression;
    indexName?: string;
    pageSize?: number;
    projection?: Projection;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    segment?: number;
    scanCountLimit?: number;
    select?: Select;
    table: Table;
    totalSegments?: number;
}
export interface ScanOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    count: number;
    models: Model[];
    lastEvaluatedKey?: AttributeMap;
    responses: AWS.DynamoDB.DocumentClient.ScanOutput[];
    scannedCount: number;
}
export declare type UpdateInput = UpdateItemInput | UpdateExpressionInput;
export interface UpdateExpressionInput {
    condition?: ConditionExpression;
    key: AttributeMap;
    returnValues?: UpdateReturnValues;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
    updatable: Updatable;
}
export interface UpdateItemInput {
    condition?: ConditionExpression;
    item: AttributeMap;
    returnValues?: UpdateReturnValues;
    returnConsumedCapacity?: ReturnConsumedCapacity;
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    table: Table;
}
export interface UpdateOutput {
    consumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
    itemCollectionMetrics?: AWS.DynamoDB.DocumentClient.ItemCollectionMetrics;
    model?: Model;
    response: AWS.DynamoDB.DocumentClient.UpdateItemOutput;
}
export declare type AttributeMap = {
    [key: string]: any;
};
export declare type DeleteReturnValues = 'ALL_OLD' | 'NONE';
export declare type PutReturnValues = 'ALL_OLD' | 'NONE';
export declare type UpdateReturnValues = 'ALL_NEW' | 'ALL_OLD' | 'NONE' | 'UPDATED_NEW' | 'UPDATED_OLD';
export declare type ReturnConsumedCapacity = 'INDEXES' | 'NONE' | 'TOTAL';
export declare type ReturnItemCollectionMetrics = 'NONE' | 'SIZE';
export declare type Select = 'ALL_ATTRIBUTES' | 'ALL_PROJECTED_ATTRIBUTES' | 'COUNT' | 'SPECIFIC_ATTRIBUTES';
