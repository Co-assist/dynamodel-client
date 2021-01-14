"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _primaryKeyPaths;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const model_1 = require("./model");
const schema_1 = require("./schema");
class Table {
    constructor(schema) {
        this.schema = schema;
        _primaryKeyPaths.set(this, void 0);
    }
    get primaryKey() {
        return this.schema.primaryKey;
    }
    get primaryKeyNames() {
        if (!__classPrivateFieldGet(this, _primaryKeyPaths)) {
            __classPrivateFieldSet(this, _primaryKeyPaths, Object.values(this.schema.primaryKey));
        }
        return __classPrivateFieldGet(this, _primaryKeyPaths);
    }
    get constructors() {
        return this.schema.models;
    }
    getName(stage) {
        return stage ? `${stage}-${this.schema.name}` : this.schema.name;
    }
    getIndex(indexName) {
        var _a;
        const index = (_a = this.schema.indexes) === null || _a === void 0 ? void 0 : _a[indexName];
        if (!index) {
            throw new Error(`Index '${indexName}' not found in the table '${this.schema.name}'`);
        }
        return index;
    }
    getModelConstructor(item) {
        let constructor;
        if (model_1.isModel(item)) {
            constructor = item.constructor;
            if (!this.containsConstructor(constructor)) {
                throw new Error(`'${constructor.name}' is not supported in the table '${this.schema.name}'`);
            }
        }
        else {
            const primaryKeyNames = this.primaryKeyNames;
            constructor = this.constructors.find((constructor) => this.matchConstructor(item, constructor, primaryKeyNames));
            if (!constructor) {
                throw new Error(`No constructor found in the table '${this.schema.name}'`);
            }
        }
        return constructor;
    }
    containsConstructor(constructor) {
        return this.constructors.includes(constructor);
    }
    matchConstructor(item, constructor, keys) {
        const schema = schema_1.getSchema(constructor);
        return keys.every((key) => schema.getAttributeSchema(key).test(item[key], [key], item) || false);
    }
}
exports.Table = Table;
_primaryKeyPaths = new WeakMap();
//# sourceMappingURL=table.js.map