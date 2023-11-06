"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const projectionExpression_1 = require("../expression/projectionExpression");
const objectUtils_1 = require("../util/objectUtils");
const dynamoOutputUtils_1 = require("../util/dynamoOutputUtils");
const model_1 = require("../model");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class QueryRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
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
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table, params.indexName);
        this.projectionExpression = (0, projectionExpression_1.serializeProjection)(params.projection, context);
        this.filterExpression = params.filter?.serialize(context);
        this.keyConditionExpression = params.keyCondition?.serialize(context);
    }
    async execute() {
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
        const consumedCapacity = (0, dynamoOutputUtils_1.mergeQueryConsumedCapacities)(responses, this.table.getName(this.stage));
        return {
            consumedCapacity,
            count,
            models,
            lastEvaluatedKey,
            responses,
            scannedCount,
        };
    }
    sendRequest(exclusiveStartKey, limit) {
        const awsParams = {
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
        return this.documentClient.send(new lib_dynamodb_1.QueryCommand(awsParams));
    }
    getLimit(scannedCount) {
        return Math.min(this.pageSize, this.scanCountLimit - scannedCount);
    }
    buildModelsFromResponses(responses) {
        const items = (0, objectUtils_1.flatArray)(responses.map((response) => response.Items ?? []));
        return items.map((item) => (0, model_1.toModel)(item, this.table));
    }
    buildExpressionContext(attributes, table, indexName) {
        return {
            attributes,
            indexName,
            table,
        };
    }
}
exports.QueryRequest = QueryRequest;
//# sourceMappingURL=queryRequest.js.map