import { BatchGetCommandOutput, BatchWriteCommandOutput, QueryCommandOutput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Capacity, ConsumedCapacity } from '@aws-sdk/client-dynamodb';
export declare function mergeItemCollectionMetrics(responses: BatchWriteCommandOutput[], tableName: string): (Omit<import("@aws-sdk/client-dynamodb").ItemCollectionMetrics, "ItemCollectionKey"> & {
    ItemCollectionKey?: Record<string, any>;
})[];
export declare function mergeBatchDeleteUnprocessedKeys(responses: BatchWriteCommandOutput[], tableName: string): Record<string, any>[];
export declare function mergeBatchGetUnprocessedKeys(responses: BatchGetCommandOutput[], tableName: string): Record<string, any>[];
export declare function mergeBatchPutUnprocessedItems(responses: BatchWriteCommandOutput[], tableName: string): Record<string, any>[];
export declare function mergeBatchGetConsumedCapacities(responses: BatchGetCommandOutput[], tableName: string): ConsumedCapacity;
export declare function mergeBatchWriteConsumedCapacities(responses: BatchWriteCommandOutput[], tableName: string): ConsumedCapacity;
export declare function mergeQueryConsumedCapacities(responses: QueryCommandOutput[], tableName: string): ConsumedCapacity;
export declare function mergeScanConsumedCapacities(responses: ScanCommandOutput[], tableName: string): ConsumedCapacity;
export declare function mergeConsumedCapacities(consumedCapacities: ConsumedCapacity[], tableName: string): ConsumedCapacity;
export declare function mergeConsumedCapacityTable(consumedCapacities: ConsumedCapacity[]): Capacity;
export declare function mergeTableCapacity(tableCapacities: Capacity[]): Capacity;
export declare function mergeGlobalSecondaryIndexes(consumedCapacities: ConsumedCapacity[]): Record<string, Capacity>;
export declare function mergeLocalSecondaryIndexes(consumedCapacities: ConsumedCapacity[]): Record<string, Capacity>;
export declare function mergeSecondaryIndexes(indexesList: ConsumedCapacity[]): Record<string, Capacity>;
