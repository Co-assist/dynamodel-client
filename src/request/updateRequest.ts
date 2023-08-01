import { AttributeExpressions } from '../expression/attributeExpressions';
import { pickKeys, omitKeys } from '../util/objectUtils';
import { Updatable } from '../expression/updateExpression';
import { path, value, ExpressionContext } from '../expression/expression';
import { Table } from '../table';
import { ModelConstructor, isModel } from '../model';
import { getSafeSchema } from '../schema';
import {
  AttributeMap,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
  UpdateInput,
  UpdateItemInput,
  UpdateOutput,
  UpdateReturnValues,
} from '../client';
import { UpdateItemInput as AWSUpdateItemInput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class UpdateRequest {
  private table: Table;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  private returnValues?: UpdateReturnValues;
  private key: AttributeMap;
  private attributes: AttributeExpressions;
  private conditionExpression?: string;
  private updateExpression: string;
  private ModelConstructor: ModelConstructor;

  constructor(private documentClient: DynamoDBDocumentClient, params: UpdateInput, private stage: string) {
    this.table = params.table;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
    this.returnValues = params.returnValues;
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table);
    this.conditionExpression = params.condition?.serialize(context);
    const primaryKeyNames = this.table.primaryKeyNames;
    let updatable: Updatable;
    if (this.isUpdateItemInput(params)) {
      this.ModelConstructor = this.table.getModelConstructor(params.item);
      const model = isModel(params.item) ? params.item : new this.ModelConstructor(params.item);
      const schema = getSafeSchema(model);
      const item = model.toJSON();
      this.key = pickKeys(item, primaryKeyNames);
      const attributes = omitKeys(item, primaryKeyNames);
      updatable = Object.keys(attributes)
        .filter((key) => attributes[key] != null)
        .reduce((updatable, key) => {
          schema.validatePath(attributes, [key]);
          return updatable.set(path(key), value(attributes[key]));
        }, new Updatable());
    } else {
      this.ModelConstructor = this.table.getModelConstructor(params.key);
      const model = isModel(params.key) ? params.key : new this.ModelConstructor(params.key);
      const item = model.toJSON();
      this.key = pickKeys(item, primaryKeyNames);
      updatable = params.updatable;
    }
    this.updateExpression = updatable.serialize(context);
  }

  async execute(): Promise<UpdateOutput> {
    const response = await this.sendRequest();
    const model = response.Attributes && new this.ModelConstructor(response.Attributes);
    const consumedCapacity = response.ConsumedCapacity;
    const itemCollectionMetrics = response.ItemCollectionMetrics;
    return {
      consumedCapacity,
      itemCollectionMetrics,
      model,
      response,
    };
  }

  private sendRequest() {
    const awsParams: AWSUpdateItemInput = {
      ConditionExpression: this.conditionExpression,
      ExpressionAttributeNames: this.attributes.names,
      ExpressionAttributeValues: this.attributes.values,
      Key: this.key,
      ReturnValues: this.returnValues,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
      TableName: this.table.getName(this.stage),
      UpdateExpression: this.updateExpression,
    };
    const command = new UpdateItemCommand(awsParams);
    return this.documentClient.send(command);
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }

  private isUpdateItemInput(params: UpdateInput): params is UpdateItemInput {
    return (params as UpdateItemInput).item !== undefined;
  }
}
