import { AttributeExpressions } from '../expression/attributeExpressions';
import { PromiseResult } from 'aws-sdk/lib/request';
import { serializeProjection } from '../expression/projectionExpression';
import { flatArray } from '../util/objectUtils';
import { mergeScanConsumedCapacities } from '../util/dynamoOutputUtils';
import { Table } from '../table';
import { toModel, Model } from '../model';
import { ExpressionContext } from '../expression/expression';
import { AttributeMap, ReturnConsumedCapacity, ScanInput, ScanOutput, Select } from '../dbClient';

export class ScanRequest {
  private table: Table;
  private consistentRead?: boolean;
  private countLimit: number;
  private exclusiveStartKey?: AttributeMap;
  private indexName?: string;
  private pageSize: number;
  private returnConsumedCapacity?: ReturnConsumedCapacity;
  private segment?: number;
  private totalSegments?: number;
  private select?: Select;
  private scanCountLimit: number;
  private attributes: AttributeExpressions;
  private projectionExpression?: string;
  private filterExpression?: string;

  constructor(private documentClient: AWS.DynamoDB.DocumentClient, params: ScanInput, private stage: string) {
    this.table = params.table;
    this.consistentRead = params.consistentRead;
    this.countLimit = params.countLimit ?? Number.MAX_SAFE_INTEGER;
    this.scanCountLimit = params.scanCountLimit ?? Number.MAX_SAFE_INTEGER;
    this.pageSize = params.pageSize ?? Number.MAX_SAFE_INTEGER;
    this.exclusiveStartKey = params.exclusiveStartKey;
    this.indexName = params.indexName;
    this.returnConsumedCapacity = params.returnConsumedCapacity;
    this.select = params.select;
    this.attributes = new AttributeExpressions();
    const context = this.buildExpressionContext(this.attributes, this.table, this.indexName);
    this.projectionExpression = serializeProjection(params.projection, context);
    this.filterExpression = params.filter?.serialize(context);
  }

  async execute(): Promise<ScanOutput> {
    const responses: PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>[] = [];
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
    const consumedCapacity = mergeScanConsumedCapacities(responses, this.table.getName(this.stage));
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
    const awsParams: AWS.DynamoDB.DocumentClient.ScanInput = {
      ConsistentRead: this.consistentRead,
      ExclusiveStartKey: exclusiveStartKey,
      ExpressionAttributeNames: this.attributes.names,
      ExpressionAttributeValues: this.attributes.values,
      FilterExpression: this.filterExpression,
      IndexName: this.indexName,
      Limit: limit,
      ProjectionExpression: this.projectionExpression,
      Segment: this.segment,
      Select: this.select,
      ReturnConsumedCapacity: this.returnConsumedCapacity,
      TableName: this.table.getName(this.stage),
      TotalSegments: this.totalSegments,
    };
    return this.documentClient.scan(awsParams).promise();
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
