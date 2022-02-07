"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Table_primaryKeyPaths;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const model_1 = require("./model");
const schema_1 = require("./schema");
class Table {
    constructor(schema) {
        this.schema = schema;
        _Table_primaryKeyPaths.set(this, void 0);
    }
    get primaryKey() {
        return this.schema.primaryKey;
    }
    get primaryKeyNames() {
        if (!__classPrivateFieldGet(this, _Table_primaryKeyPaths, "f")) {
            __classPrivateFieldSet(this, _Table_primaryKeyPaths, Object.values(this.schema.primaryKey), "f");
        }
        return __classPrivateFieldGet(this, _Table_primaryKeyPaths, "f");
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
        if ((0, model_1.isModel)(item)) {
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
        const schema = (0, schema_1.getSchema)(constructor);
        return keys.every((key) => schema.getAttributeSchema(key).test(item[key], [key], item) || false);
    }
}
exports.Table = Table;
_Table_primaryKeyPaths = new WeakMap();
//# sourceMappingURL=table.js.map