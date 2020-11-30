"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const projectionExpression_1 = require("../expression/projectionExpression");
const model_1 = require("../model");
const objectUtils_1 = require("../util/objectUtils");
class GetRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.consistentRead = params.consistentRead;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.key = objectUtils_1.pickKeys(params.key, this.table.primaryKeyNames);
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table);
        this.projectionExpression = projectionExpression_1.serializeProjection(params.projection, context);
    }
    async execute() {
        const response = await this.sendRequest();
        const model = response.Item && model_1.toModel(response.Item, this.table);
        const consumedCapacity = response.ConsumedCapacity;
        return {
            consumedCapacity,
            model,
            response,
        };
    }
    sendRequest() {
        const awsParams = {
            ConsistentRead: this.consistentRead,
            ExpressionAttributeNames: this.attributes.names,
            Key: this.key,
            ProjectionExpression: this.projectionExpression,
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            TableName: this.table.getName(this.stage),
        };
        return this.documentClient.get(awsParams).promise();
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
}
exports.GetRequest = GetRequest;
