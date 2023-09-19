"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchPutRequest = exports.BATCH_PUT_LIMIT = void 0;
const objectUtils_1 = require("../util/objectUtils");
const dynamoOutputUtils_1 = require("../util/dynamoOutputUtils");
const model_1 = require("../model");
const schema_1 = require("../schema");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.BATCH_PUT_LIMIT = 25;
class BatchPutRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
        const items = params.items.map((item) => {
            let model;
            if (!(0, model_1.isModel)(item)) {
                const ModelConstructor = this.table.getModelConstructor(item);
                model = new ModelConstructor(item);
            }
            else {
                model = item;
            }
            const schema = (0, schema_1.getSafeSchema)(model);
            item = model.toJSON();
            schema.validate(item);
            return item;
        });
        this.itemsList = (0, objectUtils_1.splitArray)(items, exports.BATCH_PUT_LIMIT);
    }
    async execute() {
        const tableName = this.table.getName(this.stage);
        const responsePromises = this.itemsList.map((items) => this.sendRequest(items));
        const responses = await Promise.all(responsePromises);
        const itemCollectionMetrics = (0, dynamoOutputUtils_1.mergeItemCollectionMetrics)(responses, tableName);
        const unprocessedItems = (0, dynamoOutputUtils_1.mergeBatchPutUnprocessedItems)(responses, tableName);
        const consumedCapacity = (0, dynamoOutputUtils_1.mergeBatchWriteConsumedCapacities)(responses, tableName);
        return {
            consumedCapacity,
            itemCollectionMetrics,
            responses,
            unprocessedItems,
        };
    }
    sendRequest(items) {
        const tableName = this.table.getName(this.stage);
        const awsParams = {
            RequestItems: {
                [tableName]: items.map((item) => ({
                    PutRequest: {
                        Item: item,
                    },
                })),
            },
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
        };
        return this.documentClient.send(new lib_dynamodb_1.BatchWriteCommand(awsParams));
    }
}
exports.BatchPutRequest = BatchPutRequest;
//# sourceMappingURL=batchPutRequest.js.map