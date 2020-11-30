"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toModel = exports.isModel = exports.model = void 0;
const schema_1 = require("./schema");
function model(schema) {
    // @ts-ignore - cast as Model<T>
    return class ModelImpl {
        constructor(item) {
            Object.assign(this, item);
        }
        get [schema_1.ModelSchemaSymbol]() {
            return schema;
        }
        toJSON() {
            return this[schema_1.ModelSchemaSymbol].toJSON(this);
        }
    };
}
exports.model = model;
function isModel(item) {
    return schema_1.getSchema(item) !== undefined;
}
exports.isModel = isModel;
function toModel(item, table) {
    const ModelConstructor = table.getModelConstructor(item);
    return new ModelConstructor(item);
}
exports.toModel = toModel;
