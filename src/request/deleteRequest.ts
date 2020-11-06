import {
  AttributeMap,
  DeleteInput,
  DeleteOutput,
  DeleteReturnValues,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
} from '../dbClient';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { Table } from '../table';
import { toModel } from '../model';
import { ExpressionContext } from '../expression/expression';
import { pickKeys } from '../util/objectUtils';

export class DeleteRequest {
  private table: Table;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  private returnValues?: DeleteReturnValues;
  private attributes: AttributeExpressions;
  private conditionExpression?: string;
  private key: AttributeMap;

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: DeleteInput, private stage: string) {
    this.table = params.table;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
    this.returnValues = params.returnValues;
    this.key = pickKeys(params.key, this.table.primaryKeyNames);
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table);
    this.conditionExpression = params.condition?.serialize(context);
  }

  async execute(): Promise<DeleteOutput> {
    const response = await this.sendRequest();
    const model = response.Attributes && toModel(response.Attributes, this.table);
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
    const awsParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      ConditionExpression: this.conditionExpression,
      ExpressionAttributeNames: this.attributes.names,
      ExpressionAttributeValues: this.attributes.values,
      Key: this.key,
      ReturnValues: this.returnValues,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
      TableName: this.table.getName(this.stage),
    };
    return this.documentClient.delete(awsParams).promise();
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }
}
