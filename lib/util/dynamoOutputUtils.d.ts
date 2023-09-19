import { PromiseResult } from 'aws-sdk/lib/request';
export declare function mergeItemCollectionMetrics(responses: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ItemCollectionMetrics[];
export declare function mergeBatchDeleteUnprocessedKeys(responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.Key[];
export declare function mergeBatchGetUnprocessedKeys(responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchGetItemOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.Key[];
export declare function mergeBatchPutUnprocessedItems(responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.PutItemInputAttributeMap[];
export declare function mergeBatchGetConsumedCapacities(responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchGetItemOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ConsumedCapacity;
export declare function mergeBatchWriteConsumedCapacities(responses: PromiseResult<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ConsumedCapacity;
export declare function mergeQueryConsumedCapacities(responses: PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ConsumedCapacity;
export declare function mergeScanConsumedCapacities(responses: PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ConsumedCapacity;
export declare function mergeConsumedCapacities(consumedCapacities: AWS.DynamoDB.DocumentClient.ConsumedCapacity[], tableName: string): import("aws-sdk/clients/dynamodb").DocumentClient.ConsumedCapacity;
export declare function mergeConsumedCapacityTable(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]): import("aws-sdk/clients/dynamodb").DocumentClient.Capacity;
export declare function mergeTableCapacity(tableCapacities: AWS.DynamoDB.DocumentClient.Capacity[]): import("aws-sdk/clients/dynamodb").DocumentClient.Capacity;
export declare function mergeGlobalSecondaryIndexes(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]): import("aws-sdk/clients/dynamodb").DocumentClient.SecondaryIndexesCapacityMap;
export declare function mergeLocalSecondaryIndexes(consumedCapacities: AWS.DynamoDB.ConsumedCapacity[]): import("aws-sdk/clients/dynamodb").DocumentClient.SecondaryIndexesCapacityMap;
export declare function mergeSecondaryIndexes(indexesList: AWS.DynamoDB.DocumentClient.SecondaryIndexesCapacityMap[]): import("aws-sdk/clients/dynamodb").DocumentClient.SecondaryIndexesCapacityMap;
