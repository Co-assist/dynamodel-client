"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inList = exports.between = exports.not = exports.beginsWith = exports.size = exports.contains = exports.attributeType = exports.attributeNotExists = exports.attributeExists = exports.or = exports.and = exports.lowerEquals = exports.lowerThan = exports.greaterEquals = exports.greaterThan = exports.notEquals = exports.equals = void 0;
const expression_1 = require("./expression");
function equals(operand1, operand2) {
    return new ComparisonExpression('=', operand1, operand2);
}
exports.equals = equals;
function notEquals(operand1, operand2) {
    return new ComparisonExpression('<>', operand1, operand2);
}
exports.notEquals = notEquals;
function greaterThan(operand1, operand2) {
    return new ComparisonExpression('>', operand1, operand2);
}
exports.greaterThan = greaterThan;
function greaterEquals(operand1, operand2) {
    return new ComparisonExpression('>=', operand1, operand2);
}
exports.greaterEquals = greaterEquals;
function lowerThan(operand1, operand2) {
    return new ComparisonExpression('<', operand1, operand2);
}
exports.lowerThan = lowerThan;
function lowerEquals(operand1, operand2) {
    return new ComparisonExpression('<=', operand1, operand2);
}
exports.lowerEquals = lowerEquals;
function and(...conditions) {
    return new LogicalExpression('AND', conditions.filter((condition) => !!condition));
}
exports.and = and;
function or(...conditions) {
    return new LogicalExpression('OR', conditions.filter((condition) => !!condition));
}
exports.or = or;
function attributeExists(path) {
    return new FunctionBooleanExpression('attribute_exists', [path]);
}
exports.attributeExists = attributeExists;
function attributeNotExists(path) {
    return new FunctionBooleanExpression('attribute_not_exists', [path]);
}
exports.attributeNotExists = attributeNotExists;
function attributeType(path, type) {
    return new FunctionBooleanExpression('attribute_type', [path, type]);
}
exports.attributeType = attributeType;
function contains(path, operand) {
    return new FunctionBooleanExpression('contains', [path, operand]);
}
exports.contains = contains;
function size(path) {
    return new FunctionNumberExpression('size', [path]);
}
exports.size = size;
function beginsWith(path, substring) {
    return new FunctionBooleanExpression('begins_with', [path, substring]);
}
exports.beginsWith = beginsWith;
function not(condition) {
    return new NotExpression(condition);
}
exports.not = not;
function between(value, lowerBound, upperBound) {
    return new BetweenExpression(value, lowerBound, upperBound);
}
exports.between = between;
function inList(operand, values) {
    return new InListExpression(operand, values);
}
exports.inList = inList;
class ComparisonExpression {
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
class FunctionBooleanExpression extends expression_1.FunctionExpression {
    constructor(functionName, params) {
        super(functionName, params);
    }
}
class FunctionNumberExpression extends expression_1.FunctionExpression {
    constructor(functionName, params) {
        super(functionName, params);
    }
}
class LogicalExpression {
    constructor(operator, conditions) {
        this.operator = operator;
        this.conditions = conditions;
        if (conditions.length === 0) {
            // Prevent "()" serialized expression.
            throw new Error('LogicalExpression must contains at least one condition.');
        }
    }
    /** @override */
    serialize(context) {
        const conditionsExpression = this.conditions
            .map((condition) => condition.serialize(context))
            .join(` ${this.operator} `);
        return `(${conditionsExpression})`;
    }
}
class NotExpression {
    constructor(condition) {
        this.condition = condition;
    }
    /** @override */
    serialize(context) {
        const conditionExpression = this.condition.serialize(context);
        return `NOT (${conditionExpression})`;
    }
}
class BetweenExpression {
    constructor(value, lowerBound, upperBound) {
        this.value = value;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
    /** @override */
    serialize(context) {
        const valueExpression = this.value.serialize(context);
        const lowerBoundExpression = this.lowerBound.serialize(context);
        const upperBoundExpression = this.upperBound.serialize(context);
        return `${valueExpression} BETWEEN ${lowerBoundExpression} AND ${upperBoundExpression}`;
    }
}
class InListExpression {
    constructor(operand, values) {
        this.operand = operand;
        this.values = values;
    }
    /** @override */
    serialize(context) {
        const operandExpression = this.operand.serialize(context);
        const valuesExpression = this.values.map((value) => value.serialize(context)).join(', ');
        return `${operandExpression} IN (${valuesExpression})`;
    }
}
//# sourceMappingURL=conditionExpression.js.map