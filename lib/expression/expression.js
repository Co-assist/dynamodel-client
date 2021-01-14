"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionExpression = exports.ValueExpression = exports.SortKeyExpression = exports.HashKeyExpression = exports.PathArrayExpression = exports.PathExpression = exports.sortKey = exports.hashKey = exports.value = exports.path = void 0;
function path(attribute, ...subAttribute) {
    const path = [attribute, ...subAttribute];
    const reference = path.join('');
    let pathExpression = PathExpression.cache.get(reference);
    if (!pathExpression) {
        pathExpression = new PathArrayExpression(path);
        PathExpression.cache.set(reference, pathExpression);
    }
    return pathExpression;
}
exports.path = path;
function value(value) {
    return new ValueExpression(value);
}
exports.value = value;
function hashKey() {
    return HashKeyExpression.get();
}
exports.hashKey = hashKey;
function sortKey() {
    return SortKeyExpression.get();
}
exports.sortKey = sortKey;
class PathExpression {
}
exports.PathExpression = PathExpression;
PathExpression.cache = new Map();
class PathArrayExpression extends PathExpression {
    constructor(path) {
        super();
        if (typeof path[0] !== 'string') {
            throw new Error(`Path must start with an attribute name: '${path}'`);
        }
        [this.attributeName, ...this.subAttributes] = path;
    }
    /** @override */
    serialize(context) {
        const expression = context.attributes.addName(this.attributeName);
        return this.subAttributes.reduce((expression, name) => {
            switch (typeof name) {
                case 'string':
                    return `${expression}.${context.attributes.addName(name)}`;
                case 'number':
                    return `${expression}[${context.attributes.addValue(name)}]`;
                default:
                    throw new Error(`Illegal path attribute type: '${typeof name}'`);
            }
        }, expression);
    }
}
exports.PathArrayExpression = PathArrayExpression;
class HashKeyExpression extends PathExpression {
    static get() {
        if (!HashKeyExpression.instance) {
            HashKeyExpression.instance = new HashKeyExpression();
        }
        return HashKeyExpression.instance;
    }
    /** @override */
    serialize(context) {
        const table = context.table;
        const indexName = context.indexName;
        const index = indexName ? table.getIndex(indexName) : table.primaryKey;
        return context.attributes.addName(index.hash);
    }
}
exports.HashKeyExpression = HashKeyExpression;
class SortKeyExpression extends PathExpression {
    static get() {
        if (!SortKeyExpression.instance) {
            SortKeyExpression.instance = new SortKeyExpression();
        }
        return SortKeyExpression.instance;
    }
    /** @override */
    serialize(context) {
        const table = context.table;
        const indexName = context.indexName;
        const index = indexName ? table.getIndex(indexName) : table.primaryKey;
        if (!index.sort) {
            throw new Error(`No sort key found for the ${indexName ? "index '" + indexName + "'" : 'primary key'} of the table '${table.getName()}'`);
        }
        return context.attributes.addName(index.sort);
    }
}
exports.SortKeyExpression = SortKeyExpression;
class ValueExpression {
    constructor(value) {
        this.value = value;
    }
    /** @override */
    serialize(context) {
        return context.attributes.addValue(this.value);
    }
}
exports.ValueExpression = ValueExpression;
class FunctionExpression {
    constructor(functionName, params) {
        this.functionName = functionName;
        this.params = params;
    }
    /** @override */
    serialize(context) {
        const paramsExpression = this.params.map((param) => param.serialize(context)).join(', ');
        return `${this.functionName}(${paramsExpression})`;
    }
}
exports.FunctionExpression = FunctionExpression;
//# sourceMappingURL=expression.js.map