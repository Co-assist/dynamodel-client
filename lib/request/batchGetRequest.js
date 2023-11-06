"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchGetRequest = exports.BATCH_GET_LIMIT = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const projectionExpression_1 = require("../expression/projectionExpression");
const objectUtils_1 = require("../util/objectUtils");
const dynamoOutputUtils_1 = require("../util/dynamoOutputUtils");
const model_1 = require("../model");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.BATCH_GET_LIMIT = 25;
class BatchGetRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.consistentRead = params.consistentRead;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        const keys = params.keys.map((key) => (0, objectUtils_1.pickKeys)(key, this.table.primaryKeyNames));
        this.keysList = (0, objectUtils_1.splitArray)(keys, exports.BATCH_GET_LIMIT);
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table);
        this.projectionExpression = (0, projectionExpression_1.serializeProjection)(params.projection, context);
    }
    async execute() {
        const tableName = this.table.getName(this.stage);
        const responsePromises = this.keysList.map((keys) => this.sendRequest(keys));
        const responses = await Promise.all(responsePromises);
        const models = this.buildModelsFromResponses(responses, tableName);
        const consumedCapacity = (0, dynamoOutputUtils_1.mergeBatchGetConsumedCapacities)(responses, tableName);
        const unprocessedKeys = (0, dynamoOutputUtils_1.mergeBatchGetUnprocessedKeys)(responses, tableName);
        return {
            consumedCapacity,
            models,
            responses,
            unprocessedKeys,
        };
    }
    sendRequest(keys) {
        const tableName = this.table.getName(this.stage);
        const awsParams = {
            RequestItems: {
                [tableName]: {
                    Keys: keys,
                    ConsistentRead: this.consistentRead,
                    ExpressionAttributeNames: this.attributes.names,
                    ProjectionExpression: this.projectionExpression,
                },
            },
            ReturnConsumedCapacity: this.returnConsumedCapacity,
        };
        return this.documentClient.send(new lib_dynamodb_1.BatchGetCommand(awsParams));
    }
    buildModelsFromResponses(responses, tableName) {
        const items = (0, objectUtils_1.flatArray)(responses.map((response) => response.Responses?.[tableName] ?? []));
        return items.map((item) => (0, model_1.toModel)(item, this.table));
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
}
exports.BatchGetRequest = BatchGetRequest;
//# sourceMappingURL=batchGetRequest.js.map