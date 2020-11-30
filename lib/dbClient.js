"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoModel = void 0;
const batchDeleteRequest_1 = require("./request/batchDeleteRequest");
const batchGetRequest_1 = require("./request/batchGetRequest");
const batchPutRequest_1 = require("./request/batchPutRequest");
const deleteRequest_1 = require("./request/deleteRequest");
const getRequest_1 = require("./request/getRequest");
const putRequest_1 = require("./request/putRequest");
const queryRequest_1 = require("./request/queryRequest");
const scanRequest_1 = require("./request/scanRequest");
const updateRequest_1 = require("./request/updateRequest");
class DynamoModel {
    constructor(documentClient, stage) {
        this.documentClient = documentClient;
        this.stage = stage;
    }
    batchDelete(params) {
        return new batchDeleteRequest_1.BatchDeleteRequest(this.documentClient, params, this.stage).execute();
    }
    batchGet(params) {
        return new batchGetRequest_1.BatchGetRequest(this.documentClient, params, this.stage).execute();
    }
    batchPut(params) {
        return new batchPutRequest_1.BatchPutRequest(this.documentClient, params, this.stage).execute();
    }
    delete(params) {
        return new deleteRequest_1.DeleteRequest(this.documentClient, params, this.stage).execute();
    }
    get(params) {
        return new getRequest_1.GetRequest(this.documentClient, params, this.stage).execute();
    }
    put(params) {
        return new putRequest_1.PutRequest(this.documentClient, params, this.stage).execute();
    }
    query(params) {
        return new queryRequest_1.QueryRequest(this.documentClient, params, this.stage).execute();
    }
    scan(params) {
        return new scanRequest_1.ScanRequest(this.documentClient, params, this.stage).execute();
    }
    update(params) {
        return new updateRequest_1.UpdateRequest(this.documentClient, params, this.stage).execute();
    }
}
exports.DynamoModel = DynamoModel;
