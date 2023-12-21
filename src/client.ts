import { BatchDeleteRequest } from './request/batchDeleteRequest';
import { BatchGetRequest } from './request/batchGetRequest';
import { BatchPutRequest } from './request/batchPutRequest';
import { DeleteRequest } from './request/deleteRequest';
import { GetRequest } from './request/getRequest';
import { PutRequest } from './request/putRequest';
import { QueryRequest } from './request/queryRequest';
import { ScanRequest } from './request/scanRequest';
import { UpdateRequest } from './request/updateRequest';
import { Updatable } from './expression/updateExpression';
import { Projection } from './expression/projectionExpression';
import { ConditionExpression } from './expression/conditionExpression';
import { Table } from './table';
import { Model } from './model';
import {
  BatchGetCommandOutput,
  BatchWriteCommandOutput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommandOutput,
  PutCommandOutput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { ConsumedCapacity, ItemCollectionMetrics } from '@aws-sdk/client-dynamodb';

export class Dynamodel {
  constructor(
    private documentClient: DynamoDBDocumentClient,
    private stage: string,
  ) {}

  batchDelete(params: BatchDeleteInput): Promise<BatchDeleteOutput> {
    return new BatchDeleteRequest(this.documentClient, params, this.stage).execute();
  }

  batchGet(params: BatchGetInput): Promise<BatchGetOutput> {
    return new BatchGetRequest(this.documentClient, params, this.stage).execute();
  }

  batchPut(params: BatchPutInput): Promise<BatchPutOutput> {
    return new BatchPutRequest(this.documentClient, params, this.stage).execute();
  }

  delete(params: DeleteInput): Promise<DeleteOutput> {
    return new DeleteRequest(this.documentClient, params, this.stage).execute();
  }

  get(params: GetInput): Promise<GetOutput> {
    return new GetRequest(this.documentClient, params, this.stage).execute();
  }

  put(params: PutInput): Promise<PutOutput> {
    return new PutRequest(this.documentClient, params, this.stage).execute();
  }

  query(params: QueryInput): Promise<QueryOutput> {
    return new QueryRequest(this.documentClient, params, this.stage).execute();
  }

  scan(params: ScanInput): Promise<ScanOutput> {
    return new ScanRequest(this.documentClient, params, this.stage).execute();
  }

  update(params: UpdateInput): Promise<UpdateOutput> {
    return new UpdateRequest(this.documentClient, params, this.stage).execute();
  }
}

export interface BatchDeleteInput {
  keys: AttributeMap[];
  returnConsumedCapacity?: ReturnConsumedCapacity;
  returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  table: Table;
}

export interface BatchDeleteOutput {
  consumedCapacity?: ConsumedCapacity;
  itemCollectionMetrics?: ItemCollectionMetrics[];
  responses: BatchWriteCommandOutput[];
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
  consumedCapacity?: ConsumedCapacity;
  models: Model[];
  responses: BatchGetCommandOutput[];
  unprocessedKeys: AttributeMap;
}

export interface BatchPutInput {
  items: AttributeMap[];
  returnConsumedCapacity?: ReturnConsumedCapacity;
  returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  table: Table;
}

export interface BatchPutOutput {
  consumedCapacity?: ConsumedCapacity;
  itemCollectionMetrics?: ItemCollectionMetrics[];
  responses: BatchWriteCommandOutput[];
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
  consumedCapacity?: ConsumedCapacity;
  itemCollectionMetrics?: ItemCollectionMetrics;
  model?: Model;
  response: DeleteCommandOutput;
}

export interface GetInput {
  key: AttributeMap;
  consistentRead?: boolean;
  projection?: Projection;
  returnConsumedCapacity?: ReturnConsumedCapacity;
  table: Table;
}

export interface GetOutput {
  consumedCapacity?: ConsumedCapacity;
  model?: Model;
  response: GetCommandOutput;
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
  consumedCapacity?: ConsumedCapacity;
  itemCollectionMetrics?: ItemCollectionMetrics;
  model?: Model;
  response: PutCommandOutput;
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
  consumedCapacity?: ConsumedCapacity;
  count: number;
  models: Model[];
  lastEvaluatedKey?: AttributeMap;
  responses: QueryOutput[];
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
  consumedCapacity?: ConsumedCapacity;
  count: number;
  models: Model[];
  lastEvaluatedKey?: AttributeMap;
  responses: ScanOutput[];
  scannedCount: number;
}

export type UpdateInput = UpdateItemInput | UpdateExpressionInput;

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
  consumedCapacity?: ConsumedCapacity;
  itemCollectionMetrics?: ItemCollectionMetrics;
  model?: Model;
  response: UpdateCommandOutput;
}

export type AttributeMap = {
  [key: string]: any;
};

export type DeleteReturnValues = 'ALL_OLD' | 'NONE';

export type PutReturnValues = 'ALL_OLD' | 'NONE';

export type UpdateReturnValues = 'ALL_NEW' | 'ALL_OLD' | 'NONE' | 'UPDATED_NEW' | 'UPDATED_OLD';

export type ReturnConsumedCapacity = 'INDEXES' | 'NONE' | 'TOTAL';

export type ReturnItemCollectionMetrics = 'NONE' | 'SIZE';

export type Select = 'ALL_ATTRIBUTES' | 'ALL_PROJECTED_ATTRIBUTES' | 'COUNT' | 'SPECIFIC_ATTRIBUTES';
