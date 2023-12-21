import { AttributeMap, BatchGetInput, BatchGetOutput, ReturnConsumedCapacity } from '../client';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { serializeProjection } from '../expression/projectionExpression';
import { pickKeys, splitArray, flatArray } from '../util/objectUtils';
import { mergeBatchGetUnprocessedKeys, mergeBatchGetConsumedCapacities } from '../util/dynamoOutputUtils';
import { Table } from '../table';
import { toModel, Model } from '../model';
import { ExpressionContext } from '../expression/expression';
import { BatchGetCommand, BatchGetCommandInput, BatchGetCommandOutput, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const BATCH_GET_LIMIT = 25;

export class BatchGetRequest {
  private table: Table;
  private consistentRead?: boolean;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private keysList: AttributeMap[][];
  private projectionExpression?: string;
  private attributes: AttributeExpressions;

  constructor(private documentClient: DynamoDBDocumentClient, params: BatchGetInput, private stage: string) {
    this.table = params.table;
    this.consistentRead = params.consistentRead;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    const keys = params.keys.map((key) => pickKeys(key, this.table.primaryKeyNames));
    this.keysList = splitArray(keys, BATCH_GET_LIMIT);
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table);
    this.projectionExpression = serializeProjection(params.projection, context);
  }

  async execute(): Promise<BatchGetOutput> {
    const tableName = this.table.getName(this.stage);
    const responsePromises = this.keysList.map((keys) => this.sendRequest(keys));
    const responses = await Promise.all(responsePromises);
    const models = this.buildModelsFromResponses(responses, tableName);
    const consumedCapacity = mergeBatchGetConsumedCapacities(responses, tableName);
    const unprocessedKeys = mergeBatchGetUnprocessedKeys(responses, tableName);
    return {
      consumedCapacity,
      models,
      responses,
      unprocessedKeys,
    };
  }

  private sendRequest(keys: AttributeMap[]) {
    const tableName = this.table.getName(this.stage);
    const awsParams: BatchGetCommandInput = {
      RequestItems: {
        [tableName]: {
          Keys: keys,
          ConsistentRead: this.consistentRead,
          ExpressionAttributeNames: this.attributes.names,
          ProjectionExpression: this.projectionExpression,
        },
      },
      ReturnConsumedCapacity: this.returnConsumedCapacity,
    };
    return this.documentClient.send(new BatchGetCommand(awsParams));
  }

  private buildModelsFromResponses(
    responses: BatchGetCommandOutput[],
    tableName: string,
  ): Model[] {
    const items = flatArray(responses.map((response) => response.Responses?.[tableName] ?? []));
    return items.map((item) => toModel(item, this.table));
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }
}
