"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const objectUtils_1 = require("../util/objectUtils");
const updateExpression_1 = require("../expression/updateExpression");
const expression_1 = require("../expression/expression");
const model_1 = require("../model");
const schema_1 = require("../schema");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class UpdateRequest {
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
        const primaryKeyNames = this.table.primaryKeyNames;
        let updatable;
        if (this.isUpdateItemInput(params)) {
            this.ModelConstructor = this.table.getModelConstructor(params.item);
            const model = (0, model_1.isModel)(params.item) ? params.item : new this.ModelConstructor(params.item);
            const schema = (0, schema_1.getSafeSchema)(model);
            const item = model.toJSON();
            this.key = (0, objectUtils_1.pickKeys)(item, primaryKeyNames);
            const attributes = (0, objectUtils_1.omitKeys)(item, primaryKeyNames);
            updatable = Object.keys(attributes)
                .filter((key) => attributes[key] != null)
                .reduce((updatable, key) => {
                schema.validatePath(attributes, [key]);
                return updatable.set((0, expression_1.path)(key), (0, expression_1.value)(attributes[key]));
            }, new updateExpression_1.Updatable());
        }
        else {
            this.ModelConstructor = this.table.getModelConstructor(params.key);
            const model = (0, model_1.isModel)(params.key) ? params.key : new this.ModelConstructor(params.key);
            const item = model.toJSON();
            this.key = (0, objectUtils_1.pickKeys)(item, primaryKeyNames);
            updatable = params.updatable;
        }
        this.updateExpression = updatable.serialize(context);
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
    async sendRequest() {
        const awsParams = {
            ConditionExpression: this.conditionExpression,
            ExpressionAttributeNames: this.attributes.names,
            ExpressionAttributeValues: this.attributes.values,
            Key: this.key,
            ReturnValues: this.returnValues,
            ReturnConsumedCapacity: this.returnConsumedCapacity,
            ReturnItemCollectionMetrics: this.returnItemCollectionMetrics,
            TableName: this.table.getName(this.stage),
            UpdateExpression: this.updateExpression,
        };
        return this.documentClient.send(new lib_dynamodb_1.UpdateCommand(awsParams));
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
    isUpdateItemInput(params) {
        return params.item !== undefined;
    }
}
exports.UpdateRequest = UpdateRequest;
//# sourceMappingURL=updateRequest.js.map