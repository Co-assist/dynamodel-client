"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRequest = void 0;
const attributeExpressions_1 = require("../expression/attributeExpressions");
const projectionExpression_1 = require("../expression/projectionExpression");
const model_1 = require("../model");
const objectUtils_1 = require("../util/objectUtils");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class GetRequest {
    constructor(documentClient, params, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
        this.table = params.table;
        this.consistentRead = params.consistentRead;
        this.returnConsumedCapacity = params.returnConsumedCapacity;
        this.key = (0, objectUtils_1.pickKeys)(params.key, this.table.primaryKeyNames);
        this.attributes = new attributeExpressions_1.AttributeExpressions();
        const context = this.buildExpressionContext(this.attributes, this.table);
        this.projectionExpression = (0, projectionExpression_1.serializeProjection)(params.projection, context);
    }
    async execute() {
        const response = await this.sendRequest();
        const model = response.Item && (0, model_1.toModel)(response.Item, this.table);
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
        const command = new client_dynamodb_1.GetItemCommand(awsParams);
        return this.documentClient.send(command);
    }
    buildExpressionContext(attributes, table) {
        return {
            attributes,
            table,
        };
    }
}
exports.GetRequest = GetRequest;
//# sourceMappingURL=getRequest.js.map