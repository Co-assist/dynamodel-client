import {
  AttributeMap,
  BatchPutInput,
  BatchPutOutput,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
} from '../client';
import { splitArray } from '../util/objectUtils';
import {
  mergeItemCollectionMetrics,
  mergeBatchPutUnprocessedItems,
  mergeBatchWriteConsumedCapacities,
} from '../util/dynamoOutputUtils';
import { Model, isModel } from '../model';
import { Table } from '../table';
import { getSafeSchema } from '../schema';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BatchWriteItemCommand, BatchWriteItemInput as AWSBatchWriteItemInput } from '@aws-sdk/client-dynamodb';
export const BATCH_PUT_LIMIT = 25;

export class BatchPutRequest {
  private table: Table;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  private itemsList: AttributeMap[][];

  constructor(private documentClient: DynamoDBDocumentClient, params: BatchPutInput, private stage: string) {
    this.table = params.table;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
    const items = params.items.map((item) => {
      let model: Model;
      if (!isModel(item)) {
        const ModelConstructor = this.table.getModelConstructor(item);
        model = new ModelConstructor(item);
      } else {
        model = item;
      }
      const schema = getSafeSchema(model);
      item = model.toJSON();
      schema.validate(item);
      return item;
    });
    this.itemsList = splitArray(items, BATCH_PUT_LIMIT);
  }

  async execute(): Promise<BatchPutOutput> {
    const tableName = this.table.getName(this.stage);
    const responsePromises = this.itemsList.map((items) => this.sendRequest(items));
    const responses = await Promise.all(responsePromises);
    const itemCollectionMetrics = mergeItemCollectionMetrics(responses, tableName);
    const unprocessedItems = mergeBatchPutUnprocessedItems(responses, tableName);
    const consumedCapacity = mergeBatchWriteConsumedCapacities(responses, tableName);
    return {
      consumedCapacity,
      itemCollectionMetrics,
      responses,
      unprocessedItems,
    };
  }

  private sendRequest(items: AttributeMap[]) {
    const tableName = this.table.getName(this.stage);
    const awsParams: AWSBatchWriteItemInput = {
      RequestItems: {
        [tableName]: items.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
    };
    const command = new BatchWriteItemCommand(awsParams);
    return this.documentClient.send(command);
  }
}
