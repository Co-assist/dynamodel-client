import { AttributeMap, GetInput, GetOutput, ReturnConsumedCapacity } from '../dbClient';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { serializeProjection } from '../expression/projectionExpression';
import { Table } from '../table';
import { toModel } from '../model';
import { ExpressionContext } from '../expression/expression';
import { pickKeys } from '../util/objectUtils';

export class GetRequest {
  private table: Table;
  private consistentRead?: boolean;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private attributes: AttributeExpressions;
  private projectionExpression?: string;
  private key: AttributeMap;

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: GetInput, private stage: string) {
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
    const awsParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
      ConsistentRead: this.consistentRead,
      ExpressionAttributeNames: this.attributes.names,
      Key: this.key,
      ProjectionExpression: this.projectionExpression,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      TableName: this.table.getName(this.stage),
    };
    return this.documentClient.get(awsParams).promise();
  }

  private buildExpressionContext(attributes: AttributeExpressions, table: Table): ExpressionContext {
    return {
      attributes,
      table,
    };
  }
}
