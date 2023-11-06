"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const model_1 = require("../model");
const schema_1 = require("../schema");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class PutRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.returnItemCollectionMetrics = params.returnItemCollectionMetrics;
        this.returnValues = params.returnValues;
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table);
        this.conditionExpression = params.condition?.serialize(context);
        this.ModelConstructor = this.table.getModelConstructor(params.item);
        const model = (0, model_1.isModel)(params.item) ? params.item : new this.ModelConstructor(params.item);
        const schema = (0, schema_1.getSafeSchema)(model);
        this.item = model.toJSON();
        schema.validate(this.item);
    }
    async execute() {
        const response = await this.sendRequest();
        const model = response.Attributes && new this.ModelConstructor(response.Attributes);
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
            Item: this.item,
            ReturnValues: this.returnValues,
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
            TableName: this.table.getName(this.stage),
        };
        return this.documentClient.send(new lib_dynamodb_1.PutCommand(awsParams));
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
}
exports.PutRequest = PutRequest;
//# sourceMappingURL=putRequest.js.map