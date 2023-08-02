// TODO: Unit tests
import { BatchGetCommandOutput, BatchWriteCommandOutput, QueryCommandOutput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { flatArray, isDefine, sum } from './objectUtils';
import { Capacity, ConsumedCapacity } from '@aws-sdk/client-dynamodb';

/* istanbul ignore next */
export function mergeItemCollectionMetrics(
  responses: BatchWriteCommandOutput[],
  tableName: string,
) {
  return flatArray(responses.map((response) => response.ItemCollectionMetrics?.[tableName]).filter(isDefine));
}

/* istanbul ignore next */
export function mergeBatchDeleteUnprocessedKeys(
  responses: BatchWriteCommandOutput[],
  tableName: string,
) {
  const writeRequestsList = flatArray(
    responses.map((response) => response.UnprocessedItems?.[tableName]).filter(isDefine),
  );
  return writeRequestsList.map((writeRequest) => writeRequest.DeleteRequest?.Key).filter(isDefine);
}

/* istanbul ignore next */
export function mergeBatchGetUnprocessedKeys(
  responses: BatchGetCommandOutput[],
  tableName: string,
) {
  return flatArray(responses.map((response) => response.UnprocessedKeys?.[tableName]?.Keys).filter(isDefine));
}

/* istanbul ignore next */
export function mergeBatchPutUnprocessedItems(
  responses: BatchWriteCommandOutput[],
  tableName: string,
) {
  const writeRequestsList = flatArray(
    responses.map((response) => response.UnprocessedItems?.[tableName]).filter(isDefine),
  );
  return writeRequestsList.map((writeRequest) => writeRequest.PutRequest?.Item).filter(isDefine);
}

/* istanbul ignore next */
export function mergeBatchGetConsumedCapacities(
  responses: BatchGetCommandOutput[],
  tableName: string,
) {
  const consumedCapacities = flatArray(responses.map((response) => response.ConsumedCapacity).filter(isDefine));
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeBatchWriteConsumedCapacities(
  responses: BatchWriteCommandOutput[],
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
  responses: QueryCommandOutput[],
  tableName: string,
) {
  const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(isDefine);
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeScanConsumedCapacities(
  responses: ScanCommandOutput[],
  tableName: string,
) {
  const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(isDefine);
  return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}

/* istanbul ignore next */
export function mergeConsumedCapacities(
  consumedCapacities: ConsumedCapacity[],
  tableName: string,
) {
  const consumedCapacity: ConsumedCapacity = {
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
export function mergeConsumedCapacityTable(consumedCapacities: ConsumedCapacity[]) {
  const tableCapacities = consumedCapacities.map((consumedCapacity) => consumedCapacity.Table).filter(isDefine);
  return tableCapacities.length === 0 ? undefined : mergeTableCapacity(tableCapacities);
}

/* istanbul ignore next */
export function mergeTableCapacity(tableCapacities: Capacity[]) {
  const table: Capacity = {
    CapacityUnits: sum(tableCapacities.map((table) => table.CapacityUnits).filter(isDefine)),
    ReadCapacityUnits: sum(tableCapacities.map((table) => table.ReadCapacityUnits).filter(isDefine)),
    WriteCapacityUnits: sum(tableCapacities.map((table) => table.WriteCapacityUnits).filter(isDefine)),
  };
  return table;
}

/* istanbul ignore next */
export function mergeGlobalSecondaryIndexes(consumedCapacities: ConsumedCapacity[]) {
  const indexesList = consumedCapacities
    .map((consumedCapacity) => consumedCapacity.GlobalSecondaryIndexes)
    .filter(isDefine);
  return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}

/* istanbul ignore next */
export function mergeLocalSecondaryIndexes(consumedCapacities: ConsumedCapacity[]) {
  const indexesList = consumedCapacities
    .map((consumedCapacity) => consumedCapacity.LocalSecondaryIndexes)
    .filter(isDefine);
  return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}

/* istanbul ignore next */
export function mergeSecondaryIndexes(indexesList: ConsumedCapacity[]): Record<string, Capacity> {
  const newIndexes: Record<string, Capacity> = {};
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
