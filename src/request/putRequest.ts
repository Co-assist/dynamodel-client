import {
  AttributeMap,
  PutInput,
  PutOutput,
  PutReturnValues,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
} from '../dbClient';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { ModelConstructor, isModel } from '../model';
import { Table } from '../table';
import { getSafeSchema } from '../schema';
import { ExpressionContext } from '../expression/expression';

export class PutRequest {
  private table: Table;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  private returnValues?: PutReturnValues;
  private attributes: AttributeExpressions;
  private conditionExpression?: string;
  private ModelConstructor: ModelConstructor;
  private item: AttributeMap;

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: PutInput, private stage: string) {
    this.table = params.table;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
    this.returnValues = params.returnValues;
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table);
    this.conditionExpression = params.condition?.serialize(context);

    this.ModelConstructor = this.table.getModelConstructor(params.item);
    const model = isModel(params.item) ? params.item : new this.ModelConstructor(params.item);
    const schema = getSafeSchema(model);
    this.item = model.toJSON();
    schema.validate(this.item);
  }

  async execute(): Promise<PutOutput> {
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
    const awsParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression: this.conditionExpression,
      ExpressionAttributeNames: this.attributes.names,
      ExpressionAttributeValues: this.attributes.values,
      Item: this.item,
      ReturnValues: this.returnValues,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
      TableName: this.table.getName(this.stage),
    };
    return this.documentClient.put(awsParams).promise();
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }
}
