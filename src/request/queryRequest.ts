import { AttributeMap, QueryInput, QueryOutput, ReturnConsumedCapacity, Select } from '../dbClient';
import { AttributeExpressions } from '../expression/attributeExpressions';
import { PromiseResult } from 'aws-sdk/lib/request';
import { serializeProjection } from '../expression/projectionExpression';
import { flatArray } from '../util/objectUtils';
import { mergeQueryConsumedCapacities } from '../util/dynamoOutputUtils';
import { Table } from '../table';
import { toModel, Model } from '../model';
import { ExpressionContext } from '../expression/expression';

export class QueryRequest {
  private table: Table;
  private consistentRead?: boolean;
  private countLimit: number;
  private exclusiveStartKey?: AttributeMap;
  private indexName?: string;
  private pageSize: number;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private select?: Select;
  private scanCountLimit: number;
  private scanIndexForward?: boolean;
  private attributes: AttributeExpressions;
  private projectionExpression?: string;
  private filterExpression?: string;
  private keyConditionExpression?: string;

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: QueryInput, private stage: string) {
    this.table = params.table;
    this.consistentRead = params.consistentRead;
    this.countLimit = params.countLimit ?? Number.MAX_SAFE_INTEGER;
    this.scanCountLimit = params.scanCountLimit ?? Number.MAX_SAFE_INTEGER;
    this.pageSize = params.pageSize ?? Number.MAX_SAFE_INTEGER;
    this.exclusiveStartKey = params.exclusiveStartKey;
    this.indexName = params.indexName;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.select = params.select;
    this.scanIndexForward = params.scanIndexForward;
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table, params.indexName);
    this.projectionExpression = serializeProjection(params.projection, context);
    this.filterExpression = params.filter?.serialize(context);
    this.keyConditionExpression = params.keyCondition?.serialize(context);
  }

  async execute(): Promise<QueryOutput> {
    const responses: PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>[] = [];
    let lastEvaluatedKey = this.exclusiveStartKey;
    let count = 0;
    let scannedCount = 0;
    do {
      const response = await this.sendRequest(lastEvaluatedKey, this.getLimit(scannedCount));
      count += response.Count ?? 0;
      scannedCount += response.ScannedCount ?? 0;
      lastEvaluatedKey = response.LastEvaluatedKey;
      responses.push(response);
    } while (lastEvaluatedKey && count < this.countLimit && scannedCount < this.scanCountLimit);
    const models = this.buildModelsFromResponses(responses);
    const consumedCapacity = mergeQueryConsumedCapacities(responses, this.table.getName(this.stage));
    return {
      consumedCapacity,
      count,
      models,
      lastEvaluatedKey,
      responses,
      scannedCount,
    };
  }

  private sendRequest(exclusiveStartKey: AWS.DynamoDB.DocumentClient.Key | undefined, limit: number) {
    const awsParams: AWS.DynamoDB.DocumentClient.QueryInput = {
      ConsistentRead: this.consistentRead,
      ExclusiveStartKey: exclusiveStartKey,
      ExpressionAttributeNames: this.attributes.names,
      ExpressionAttributeValues: this.attributes.values,
      FilterExpression: this.filterExpression,
      IndexName: this.indexName,
      KeyConditionExpression: this.keyConditionExpression,
      Limit: limit,
      ProjectionExpression: this.projectionExpression,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      Select: this.select,
      ScanIndexForward: this.scanIndexForward,
      TableName: this.table.getName(this.stage),
    };
    return this.documentClient.query(awsParams).promise();
  }

  private getLimit(scannedCount: number) {
    return Math.min(this.pageSize, this.scanCountLimit - scannedCount);
  }

  private buildModelsFromResponses(responses: AWS.DynamoDB.DocumentClient.QueryOutput[]): Model[] {
    const items = flatArray(responses.map((response) => response.Items ?? []));
    return items.map((item) => toModel(item, this.table));
  }

  private buildExpressionContext(
    attributes: AttributeExpressions,
    table: Table,
    indexName?: string,
  ): ExpressionContext {
    return {
      attributes,
      indexName,
      table,
    };
  }
}
