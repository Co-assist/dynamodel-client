import { AttributeMap, GetInput, GetOutput, ReturnConsumedCapacity } from '../client';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { serializeProjection } from '../expression/projectionExpression';
import { Table } from '../table';
import { toModel } from '../model';
import { ExpressionContext } from '../expression/expression';
import { pickKeys } from '../util/objectUtils';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetItemInput as AWSGetItemInput, GetItemCommand } from '@aws-sdk/client-dynamodb';

export class GetRequest {
  private table: Table;
  private consistentRead?: boolean;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private attributes: AttributeExpressions;
  private projectionExpression?: string;
  private key: AttributeMap;

  constructor(private documentClient: DynamoDBDocumentClient, params: GetInput, private stage: string) {
    this.table = params.table;
    this.consistentRead = params.consistentRead;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.key = pickKeys(params.key, this.table.primaryKeyNames);
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table);
    this.projectionExpression = serializeProjection(params.projection, context);
  }

  async execute(): Promise<GetOutput> {
    const response = await this.sendRequest();
    const model = response.Item && toModel(response.Item, this.table);
    const consumedCapacity = response.ConsumedCapacity;
    return {
      consumedCapacity,
      model,
      response,
    };
  }

  private sendRequest() {
    const awsParams: AWSGetItemInput = {
      ConsistentRead: this.consistentRead,
      ExpressionAttributeNames: this.attributes.names,
      Key: this.key,
      ProjectionExpression: this.projectionExpression,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      TableName: this.table.getName(this.stage),
    };
    const command = new GetItemCommand(awsParams);
    return this.documentClient.send(command);
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }
}
