"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSecondaryIndexes = exports.mergeLocalSecondaryIndexes = exports.mergeGlobalSecondaryIndexes = exports.mergeTableCapacity = exports.mergeConsumedCapacityTable = exports.mergeConsumedCapacities = exports.mergeScanConsumedCapacities = exports.mergeQueryConsumedCapacities = exports.mergeBatchWriteConsumedCapacities = exports.mergeBatchGetConsumedCapacities = exports.mergeBatchPutUnprocessedItems = exports.mergeBatchGetUnprocessedKeys = exports.mergeBatchDeleteUnprocessedKeys = exports.mergeItemCollectionMetrics = void 0;
// TODO: Unit tests
const objectUtils_1 = require("./objectUtils");
/* istanbul ignore next */
function mergeItemCollectionMetrics(responses, tableName) {
    return objectUtils_1.flatArray(responses.map((response) => { var _a; return (_a = response.ItemCollectionMetrics) === null || _a === void 0 ? void 0 : _a[tableName]; }).filter(objectUtils_1.isDefine));
}
exports.mergeItemCollectionMetrics = mergeItemCollectionMetrics;
/* istanbul ignore next */
function mergeBatchDeleteUnprocessedKeys(responses, tableName) {
    const writeRequestsList = objectUtils_1.flatArray(responses.map((response) => { var _a; return (_a = response.UnprocessedItems) === null || _a === void 0 ? void 0 : _a[tableName]; }).filter(objectUtils_1.isDefine));
    return writeRequestsList.map((writeRequest) => { var _a; return (_a = writeRequest.DeleteRequest) === null || _a === void 0 ? void 0 : _a.Key; }).filter(objectUtils_1.isDefine);
}
exports.mergeBatchDeleteUnprocessedKeys = mergeBatchDeleteUnprocessedKeys;
/* istanbul ignore next */
function mergeBatchGetUnprocessedKeys(responses, tableName) {
    return objectUtils_1.flatArray(responses.map((response) => { var _a; return (_a = response.UnprocessedKeys) === null || _a === void 0 ? void 0 : _a[tableName].Keys; }).filter(objectUtils_1.isDefine));
}
exports.mergeBatchGetUnprocessedKeys = mergeBatchGetUnprocessedKeys;
/* istanbul ignore next */
function mergeBatchPutUnprocessedItems(responses, tableName) {
    const writeRequestsList = objectUtils_1.flatArray(responses.map((response) => { var _a; return (_a = response.UnprocessedItems) === null || _a === void 0 ? void 0 : _a[tableName]; }).filter(objectUtils_1.isDefine));
    return writeRequestsList.map((writeRequest) => { var _a; return (_a = writeRequest.PutRequest) === null || _a === void 0 ? void 0 : _a.Item; }).filter(objectUtils_1.isDefine);
}
exports.mergeBatchPutUnprocessedItems = mergeBatchPutUnprocessedItems;
/* istanbul ignore next */
function mergeBatchGetConsumedCapacities(responses, tableName) {
    const consumedCapacities = objectUtils_1.flatArray(responses.map((response) => response.ConsumedCapacity).filter(objectUtils_1.isDefine));
    return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}
exports.mergeBatchGetConsumedCapacities = mergeBatchGetConsumedCapacities;
/* istanbul ignore next */
function mergeBatchWriteConsumedCapacities(responses, tableName) {
    const consumedCapacitiesMixed = objectUtils_1.flatArray(responses.map((response) => response.ConsumedCapacity).filter(objectUtils_1.isDefine));
    const consumedCapacities = consumedCapacitiesMixed.filter((consumedCapacity) => consumedCapacity.TableName === tableName);
    return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}
exports.mergeBatchWriteConsumedCapacities = mergeBatchWriteConsumedCapacities;
/* istanbul ignore next */
function mergeQueryConsumedCapacities(responses, tableName) {
    const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(objectUtils_1.isDefine);
    return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}
exports.mergeQueryConsumedCapacities = mergeQueryConsumedCapacities;
/* istanbul ignore next */
function mergeScanConsumedCapacities(responses, tableName) {
    const consumedCapacities = responses.map((response) => response.ConsumedCapacity).filter(objectUtils_1.isDefine);
    return consumedCapacities.length === 0 ? undefined : mergeConsumedCapacities(consumedCapacities, tableName);
}
exports.mergeScanConsumedCapacities = mergeScanConsumedCapacities;
/* istanbul ignore next */
function mergeConsumedCapacities(consumedCapacities, tableName) {
    const consumedCapacity = {
        TableName: tableName,
        CapacityUnits: objectUtils_1.sum(consumedCapacities.map((consumedCapacity) => consumedCapacity.CapacityUnits).filter(objectUtils_1.isDefine)),
        ReadCapacityUnits: objectUtils_1.sum(consumedCapacities.map((consumedCapacity) => consumedCapacity.ReadCapacityUnits).filter(objectUtils_1.isDefine)),
        WriteCapacityUnits: objectUtils_1.sum(consumedCapacities.map((consumedCapacity) => consumedCapacity.WriteCapacityUnits).filter(objectUtils_1.isDefine)),
        Table: mergeConsumedCapacityTable(consumedCapacities),
        LocalSecondaryIndexes: mergeLocalSecondaryIndexes(consumedCapacities),
        GlobalSecondaryIndexes: mergeGlobalSecondaryIndexes(consumedCapacities),
    };
    return consumedCapacity;
}
exports.mergeConsumedCapacities = mergeConsumedCapacities;
/* istanbul ignore next */
function mergeConsumedCapacityTable(consumedCapacities) {
    const tableCapacities = consumedCapacities.map((consumedCapacity) => consumedCapacity.Table).filter(objectUtils_1.isDefine);
    return tableCapacities.length === 0 ? undefined : mergeTableCapacity(tableCapacities);
}
exports.mergeConsumedCapacityTable = mergeConsumedCapacityTable;
/* istanbul ignore next */
function mergeTableCapacity(tableCapacities) {
    const table = {
        CapacityUnits: objectUtils_1.sum(tableCapacities.map((table) => table.CapacityUnits).filter(objectUtils_1.isDefine)),
        ReadCapacityUnits: objectUtils_1.sum(tableCapacities.map((table) => table.ReadCapacityUnits).filter(objectUtils_1.isDefine)),
        WriteCapacityUnits: objectUtils_1.sum(tableCapacities.map((table) => table.WriteCapacityUnits).filter(objectUtils_1.isDefine)),
    };
    return table;
}
exports.mergeTableCapacity = mergeTableCapacity;
/* istanbul ignore next */
function mergeGlobalSecondaryIndexes(consumedCapacities) {
    const indexesList = consumedCapacities
        .map((consumedCapacity) => consumedCapacity.GlobalSecondaryIndexes)
        .filter(objectUtils_1.isDefine);
    return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}
exports.mergeGlobalSecondaryIndexes = mergeGlobalSecondaryIndexes;
/* istanbul ignore next */
function mergeLocalSecondaryIndexes(consumedCapacities) {
    const indexesList = consumedCapacities
        .map((consumedCapacity) => consumedCapacity.LocalSecondaryIndexes)
        .filter(objectUtils_1.isDefine);
    return indexesList.length === 0 ? undefined : mergeSecondaryIndexes(indexesList);
}
exports.mergeLocalSecondaryIndexes = mergeLocalSecondaryIndexes;
/* istanbul ignore next */
function mergeSecondaryIndexes(indexesList) {
    const newIndexes = {};
    indexesList.forEach((indexes) => {
        Object.keys(indexes).forEach((key) => {
            var _a;
            const index = indexes[key];
            const newIndex = (_a = newIndexes[key]) !== null && _a !== void 0 ? _a : (newIndexes[key] = {});
            if (index.CapacityUnits) {
                newIndex.CapacityUnits = (newIndex.CapacityUnits || 0) + index.CapacityUnits;
            }
            if (index.ReadCapacityUnits) {
                newIndex.ReadCapacityUnits = (newIndex.ReadCapacityUnits || 0) + index.ReadCapacityUnits;
            }
            if (index.WriteCapacityUnits) {
                newIndex.WriteCapacityUnits = (newIndex.WriteCapacityUnits || 0) + index.WriteCapacityUnits;
            }
        });
    });
    return newIndexes;
}
exports.mergeSecondaryIndexes = mergeSecondaryIndexes;
