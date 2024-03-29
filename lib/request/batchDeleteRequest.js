"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchDeleteRequest = exports.BATCH_DELETE_LIMIT = void 0;
const dynamoOutputUtils_1 = require("../util/dynamoOutputUtils");
const objectUtils_1 = require("../util/objectUtils");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.BATCH_DELETE_LIMIT = 25;
class BatchDeleteRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
        const keys = params.keys.map((key) => (0, objectUtils_1.pickKeys)(key, this.table.primaryKeyNames));
        this.keysList = (0, objectUtils_1.splitArray)(keys, exports.BATCH_DELETE_LIMIT);
    }
    async execute() {
        const tableName = this.table.getName(this.stage);
        const responsePromises = this.keysList.map((keys) => this.sendRequest(keys));
        const responses = await Promise.all(responsePromises);
        const itemCollectionMetrics = (0, dynamoOutputUtils_1.mergeItemCollectionMetrics)(responses, tableName);
        const unprocessedKeys = (0, dynamoOutputUtils_1.mergeBatchDeleteUnprocessedKeys)(responses, tableName);
        const consumedCapacity = (0, dynamoOutputUtils_1.mergeBatchWriteConsumedCapacities)(responses, tableName);
        return {
            consumedCapacity,
            itemCollectionMetrics,
            responses,
            unprocessedKeys,
        };
    }
    sendRequest(keys) {
        const tableName = this.table.getName(this.stage);
        const awsParams = {
            RequestItems: {
                [tableName]: keys.map((key) => ({
                    DeleteRequest: {
                        Key: key,
                    },
                })),
            },
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
        };
        return this.documentClient.send(new lib_dynamodb_1.BatchWriteCommand(awsParams));
    }
}
exports.BatchDeleteRequest = BatchDeleteRequest;
//# sourceMappingURL=batchDeleteRequest.js.map