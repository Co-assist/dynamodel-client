// TODO: Unit tests
import { flatArray, isDefine, sum } from './objectUtils';
import { PromiseResult } from 'aws-sdk/lib/request';

/* istanbul ignore next */
export function mergeItemCollectionMetrics(
  responses: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput[],
  tableName: string,
) {
  return flatArray(responses.map((response) => response.ItemCollectionMetrics?.[tableName]).filter(isDefine));
}

/* istanbul ignore next */
export function mergeBatchDeleteUnprocessedKeys(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[],
  tableName: string,
) {
  const writeRequestsList = flatArray(
    responses.map((response) => response.UnprocessedItems?.[tableName]).filter(isDefine),
  );
  return writeRequestsList.map((writeRequest) => writeRequest.DeleteRequest?.Key).filter(isDefine);
}

/* istanbul ignore next */
export function mergeBatchGetUnprocessedKeys(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchGetItemOutput, AWS.AWSError>[],
  tableName: string,
) {
  return flatArray(responses.map((response) => response.UnprocessedKeys?.[tableName]?.Keys).filter(isDefine));
}

/* istanbul ignore next */
export function mergeBatchPutUnprocessedItems(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[],
  tableName: string,
) {
  const writeRequestsList = flatArray(
    responses.map((response) => response.UnprocessedItems?.[tableName]).filter(isDefine),
  );
  return writeRequestsList.map((writeRequest) => writeRequest.PutRequest?.Item).filter(isDefine);
}

/* istanbul ignore next */
export function mergeBatchGetConsumedCapacities(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchGetItemOutput, AWS.AWSError>[],
  tableName: string,
) {
  const consumedCapacities = flatArray(responses.map((response) => response.ConsumedCapacity).filter(isDefine));
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeBatchWriteConsumedCapacities(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[],
  tableName: string,
) {
  const consumedCapacitiesMixed = flatArray(responses.map((response) => response.ConsumedCapacity).filter(isDefine));
  const consumedCapacities = consumedCapacitiesMixed.filter(
    (consumedCapacity) => consumedCapacity.TableName === tableName,
  );
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeQueryConsumedCapacities(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>[],
  tableName: string,
) {
  const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(isDefine);
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeScanConsumedCapacities(
  responses: PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>[],
  tableName: string,
) {
  const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(isDefine);
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeConsumedCapacities(
  consumedCapacities: AWS.DynamoDB.DocumentClient.ConsumedCapacity[],
  tableName: string,
) {
  const consumedCapacity: AWS.DynamoDB.DocumentClient.ConsumedCapacity = {
    TableName: tableName,
    CapacityUnits: sum(consumedCapacities.map((consumedCapacity) => consumedCapacity.CapacityUnits).filter(isDefine)),
    ReadCapacityUnits: sum(
      consumedCapacities.map((consumedCapacity) => consumedCapacity.ReadCapacityUnits).filter(isDefine),
    ),
    WriteCapacityUnits: sum(
      consumedCapacities.map((consumedCapacity) => consumedCapacity.WriteCapacityUnits).filter(isDefine),
    ),
    Table: mergeConsumedCapacityTable(consumedCapacities),
    LocalSecondaryIndexes: mergeLocalSecondaryIndexes(consumedCapacities),
    GlobalSecondaryIndexes: mergeGlobalSecondaryIndexes(consumedCapacities),
  };
  return consumedCapacity;
}

/* istanbul ignore next */
export function mergeConsumedCapacityTable(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]) {
  const tableCapacities = consumedCapacities.map((consumedCapacity) => consumedCapacity.Table).filter(isDefine);
  return tableCapacities.length === 0 ? undefined : mergeTableCapacity(tableCapacities);
}

/* istanbul ignore next */
export function mergeTableCapacity(tableCapacities: AWS.DynamoDB.DocumentClient.Capacity[]) {
  const table: AWS.DynamoDB.DocumentClient.Capacity = {
    CapacityUnits: sum(tableCapacities.map((table) => table.CapacityUnits).filter(isDefine)),
    ReadCapacityUnits: sum(tableCapacities.map((table) => table.ReadCapacityUnits).filter(isDefine)),
    WriteCapacityUnits: sum(tableCapacities.map((table) => table.WriteCapacityUnits).filter(isDefine)),
  };
  return table;
}

/* istanbul ignore next */
export function mergeGlobalSecondaryIndexes(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]) {
  const indexesList = consumedCapacities
    .map((consumedCapacity) => consumedCapacity.GlobalSecondaryIndexes)
    .filter(isDefine);
  return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}

/* istanbul ignore next */
export function mergeLocalSecondaryIndexes(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]) {
  const indexesList = consumedCapacities
    .map((consumedCapacity) => consumedCapacity.LocalSecondaryIndexes)
    .filter(isDefine);
  return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}

/* istanbul ignore next */
export function mergeSecondaryIndexes(indexesList: AWS.DynamoDB.DocumentClient.SecondaryIndexesCapacityMap[]) {
  const newIndexes: AWS.DynamoDB.DocumentClient.SecondaryIndexesCapacityMap = {};
  indexesList.forEach((indexes) => {
    Object.keys(indexes).forEach((key) => {
      const index = indexes[key];
      const newIndex = newIndexes[key] ?? (newIndexes[key] = {});
      if (index.CapacityUnits) {
        newIndex.CapacityUnits = (newIndex.CapacityUnits || 0) + index.CapacityUnits;
      }
      if (index.ReadCapacityUnits) {
        newIndex.ReadCapacityUnits = (newIndex.ReadCapacityUnits || 0) + index.ReadCapacityUnits;
      }
      if (index.WriteCapacityUnits) {
        newIndex.WriteCapacityUnits = (newIndex.WriteCapacityUnits || 0) + index.WriteCapacityUnits;
      }
    });
  });
  return newIndexes;
}
