import { AttributeExpressions } from '../expression/attributeExpressions';
import { serializeProjection } from '../expression/projectionExpression';
import { flatArray } from '../util/objectUtils';
import { mergeScanConsumedCapacities } from '../util/dynamoOutputUtils';
import { Table } from '../table';
import { toModel, Model } from '../model';
import { ExpressionContext } from '../expression/expression';
import { AttributeMap, ReturnConsumedCapacity, ScanInput, ScanOutput, Select } from '../client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ScanCommand, ScanCommandInput as AWSScanCommandInput, ScanCommandOutput as AWSScanCommandOutput } from '@aws-sdk/client-dynamodb';

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

  constructor(private documentClient: DynamoDBDocumentClient, params: ScanInput, private stage: string) {
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
    const responses = [];
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

  private sendRequest(exclusiveStartKey: AWSScanCommandInput['ExclusiveStartKey'] | undefined, limit: number) {
    const awsParams: AWSScanCommandInput = {
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
    const command = new ScanCommand(awsParams);
    return this.documentClient.send(command);
  }

  private getLimit(scannedCount: number) {
    return Math.min(this.pageSize, this.scanCountLimit - scannedCount);
  }

  private buildModelsFromResponses(responses: AWSScanCommandOutput[]): Model[] {
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
