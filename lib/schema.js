"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeSchema = exports.getSchema = exports.Schemaless = exports.Schema = exports.ModelSchemaSymbol = void 0;
exports.ModelSchemaSymbol = Symbol('ModelSchema');
class Schema {
    constructor(json) {
        this.json = json;
        if (!this.json) {
            throw new Error('Empty schema');
        }
    }
    /** @override */
    getAttributeSchema(attributeName) {
        return this.json[attributeName];
    }
    /** @override */
    validate(object) {
        for (const attributeName in this.json) {
            this.validatePath(object, [attributeName]);
        }
    }
    /** @override */
    validatePath(object, path) {
        const [attributeName] = path;
        const attributeSchema = this.getAttributeSchema(attributeName);
        if (attributeSchema?.test(object[attributeName], path, object) !== true) {
            throw new Error(`Invalid value for the path '${path.join(', ')}'`);
        }
    }
    /** @override */
    toJSON(object) {
        const json = {};
        for (const key in this.json) {
            if (object[key] !== undefined) {
                json[key] = object[key];
            }
        }
        return json;
    }
}
exports.Schema = Schema;
class Schemaless extends Schema {
    /** @override */
    getAttributeSchema(attributeName) {
        return super.getAttributeSchema(attributeName) ?? Schemaless.ATTRIBUTE_SCHEMA;
    }
    /** @override */
    toJSON(object) {
        const json = super.toJSON(object);
        for (const key in object) {
            if (!(key in json)) {
                json[key] = object[key];
            }
        }
        return json;
    }
}
exports.Schemaless = Schemaless;
Schemaless.ATTRIBUTE_SCHEMA = {
    test: () => true,
};
function getSchema(object) {
    return object[exports.ModelSchemaSymbol] || object.prototype?.[exports.ModelSchemaSymbol];
}
exports.getSchema = getSchema;
function getSafeSchema(object) {
    const schema = getSchema(object);
    if (!schema) {
        throw new Error('No schema found for the given object');
    }
    return schema;
}
exports.getSafeSchema = getSafeSchema;
//# sourceMappingURL=schema.js.map