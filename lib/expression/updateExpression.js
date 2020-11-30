"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updatable = exports.substraction = exports.addition = exports.listAppend = exports.ifNotExists = void 0;
const objectUtils_1 = require("../util/objectUtils");
const expression_1 = require("./expression");
function ifNotExists(path, value) {
    return new IfNotExistsExpression(path, value);
}
exports.ifNotExists = ifNotExists;
function listAppend(list1, list2) {
    return new ListAppendExpression(list1, list2);
}
exports.listAppend = listAppend;
function addition(operand1, operand2) {
    return new BinaryOperationExpression('+', operand1, operand2);
}
exports.addition = addition;
function substraction(operand1, operand2) {
    return new BinaryOperationExpression('-', operand1, operand2);
}
exports.substraction = substraction;
class Updatable {
    constructor() {
        this.addMap = new Map();
        this.deleteMap = new Map();
        this.removeSet = new Set();
        this.setMap = new Map();
    }
    add(path, value) {
        this.addMap.set(path, value);
        return this;
    }
    delete(path, value) {
        this.deleteMap.set(path, value);
        return this;
    }
    remove(path) {
        this.removeSet.add(path);
        return this;
    }
    set(path, value) {
        this.setMap.set(path, value);
        return this;
    }
    /** @override */
    serialize(context) {
        const expressions = [
            this.serializeAdd(context),
            this.serializeDelete(context),
            this.serializeRemove(context),
            this.serializeSet(context),
        ];
        return expressions.filter((expression) => expression !== undefined).join(' ');
    }
    serializeAdd(context) {
        if (this.addMap.size === 0) {
            return undefined;
        }
        const expression = objectUtils_1.mapToArray(this.addMap)
            .map(([path, value]) => {
            const pathExpression = path.serialize(context);
            const valueExpression = value.serialize(context);
            return `${pathExpression} ${valueExpression}`;
        })
            .join(', ');
        return `ADD ${expression}`;
    }
    serializeDelete(context) {
        if (this.deleteMap.size === 0) {
            return undefined;
        }
        const expression = objectUtils_1.mapToArray(this.deleteMap)
            .map(([path, subset]) => {
            const pathExpression = path.serialize(context);
            const subsetExpression = subset.serialize(context);
            return `${pathExpression} ${subsetExpression}`;
        })
            .join(', ');
        return `DELETE ${expression}`;
    }
    serializeRemove(context) {
        if (this.removeSet.size === 0) {
            return undefined;
        }
        const expression = objectUtils_1.setToArray(this.removeSet)
            .map((path) => path.serialize(context))
            .join(', ');
        return `REMOVE ${expression}`;
    }
    serializeSet(context) {
        if (this.setMap.size === 0) {
            return undefined;
        }
        const expression = objectUtils_1.mapToArray(this.setMap)
            .map(([path, value]) => {
            const pathExpression = path.serialize(context);
            const valueExpression = value.serialize(context);
            return `${pathExpression} = ${valueExpression}`;
        })
            .join(', ');
        return `SET ${expression}`;
    }
}
exports.Updatable = Updatable;
class BinaryOperationExpression {
    constructor(operator, operand1, operand2) {
        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    }
    /** @override */
    serialize(context) {
        const operand1Expression = this.operand1.serialize(context);
        const operand2Expression = this.operand2.serialize(context);
        return `${operand1Expression} ${this.operator} ${operand2Expression}`;
    }
}
class IfNotExistsExpression extends expression_1.FunctionExpression {
    constructor(path, value) {
        super('if_not_exists', [path, value]);
    }
}
class ListAppendExpression extends expression_1.FunctionExpression {
    constructor(list1, list2) {
        super('list_append', [list1, list2]);
    }
}
