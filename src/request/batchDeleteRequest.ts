import {
  AttributeMap,
  BatchDeleteInput,
  BatchDeleteOutput,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
} from '../client';
import {
  mergeItemCollectionMetrics,
  mergeBatchWriteConsumedCapacities,
  mergeBatchDeleteUnprocessedKeys,
} from '../util/dynamoOutputUtils';
import { pickKeys, splitArray } from '../util/objectUtils';
import { Table } from '../table';

export const BATCH_DELETE_LIMIT = 25;

export class BatchDeleteRequest {
  private table: Table;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  private keysList: AttributeMap[][];

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: BatchDeleteInput, private stage: string) {
    this.table = params.table;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
    const keys = params.keys.map((key) => pickKeys(key, this.table.primaryKeyNames));
    this.keysList = splitArray(keys, BATCH_DELETE_LIMIT);
  }

  async execute(): Promise<BatchDeleteOutput> {
    const tableName = this.table.getName(this.stage);
    const responsePromises = this.keysList.map((keys) => this.sendRequest(keys));
    const responses = await Promise.all(responsePromises);
    const itemCollectionMetrics = mergeItemCollectionMetrics(responses, tableName);
    const unprocessedKeys = mergeBatchDeleteUnprocessedKeys(responses, tableName);
    const consumedCapacity = mergeBatchWriteConsumedCapacities(responses, tableName);
    return {
      consumedCapacity,
      itemCollectionMetrics,
      responses,
      unprocessedKeys,
    };
  }

  private sendRequest(keys: AttributeMap[]) {
    const tableName = this.table.getName(this.stage);
    const awsParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [tableName]: keys.map((key) => ({
          DeleteRequest: {
            Key: key,
          },
        })),
      },
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
    };
    return this.documentClient.batchWrite(awsParams).promise();
  }
}
