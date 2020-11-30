"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const projectionExpression_1 = require("../expression/projectionExpression");
const objectUtils_1 = require("../util/objectUtils");
const dynamoOutputUtils_1 = require("../util/dynamoOutputUtils");
const model_1 = require("../model");
class QueryRequest {
    constructor(documentClient, params, stage) {
        var _a, _b, _c, _d, _e;
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.consistentRead = params.consistentRead;
        this.countLimit = (_a = params.countLimit) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
        this.scanCountLimit = (_b = params.scanCountLimit) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
        this.pageSize = (_c = params.pageSize) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
        this.exclusiveStartKey = params.exclusiveStartKey;
        this.indexName = params.indexName;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.select = params.select;
        this.scanIndexForward = params.scanIndexForward;
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table, params.indexName);
        this.projectionExpression = projectionExpression_1.serializeProjection(params.projection, context);
        this.filterExpression = (_d = params.filter) === null || _d === void 0 ? void 0 : _d.serialize(context);
        this.keyConditionExpression = (_e = params.keyCondition) === null || _e === void 0 ? void 0 : _e.serialize(context);
    }
    async execute() {
        var _a, _b;
        const responses = [];
        let lastEvaluatedKey = this.exclusiveStartKey;
        let count = 0;
        let scannedCount = 0;
        do {
            const response = await this.sendRequest(lastEvaluatedKey, this.getLimit(scannedCount));
            count += (_a = response.Count) !== null && _a !== void 0 ? _a : 0;
            scannedCount += (_b = response.ScannedCount) !== null && _b !== void 0 ? _b : 0;
            lastEvaluatedKey = response.LastEvaluatedKey;
            responses.push(response);
        } while (lastEvaluatedKey && count < this.countLimit && scannedCount < this.scanCountLimit);
        const models = this.buildModelsFromResponses(responses);
        const consumedCapacity = dynamoOutputUtils_1.mergeQueryConsumedCapacities(responses, this.table.getName(this.stage));
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
        return this.documentClient.query(awsParams).promise();
    }
    getLimit(scannedCount) {
        return Math.min(this.pageSize, this.scanCountLimit - scannedCount);
    }
    buildModelsFromResponses(responses) {
        const items = objectUtils_1.flatArray(responses.map((response) => { var _a; return (_a = response.Items) !== null && _a !== void 0 ? _a : []; }));
        return items.map((item) => model_1.toModel(item, this.table));
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
