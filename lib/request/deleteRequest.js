"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const model_1 = require("../model");
const objectUtils_1 = require("../util/objectUtils");
class DeleteRequest {
    constructor(documentClient, params, stage) {
        var _a;
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
        this.returnValues = params.returnValues;
        this.key = objectUtils_1.pickKeys(params.key, this.table.primaryKeyNames);
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table);
        this.conditionExpression = (_a = params.condition) === null || _a === void 0 ? void 0 : _a.serialize(context);
    }
    async execute() {
        const response = await this.sendRequest();
        const model = response.Attributes && model_1.toModel(response.Attributes, this.table);
        const consumedCapacity = response.ConsumedCapacity;
        const itemCollectionMetrics = response.ItemCollectionMetrics;
        return {
            consumedCapacity,
            itemCollectionMetrics,
            model,
            response,
        };
    }
    sendRequest() {
        const awsParams = {
            ConditionExpression: this.conditionExpression,
            ExpressionAttributeNames: this.attributes.names,
            ExpressionAttributeValues: this.attributes.values,
            Key: this.key,
            ReturnValues: this.returnValues,
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
            TableName: this.table.getName(this.stage),
        };
        return this.documentClient.delete(awsParams).promise();
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
}
exports.DeleteRequest = DeleteRequest;
//# sourceMappingURL=deleteRequest.js.map