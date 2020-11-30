"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeExpressions = void 0;
const NAME_PREFIX = '#n';
const VALUE_PREFIX = ':v';
class AttributeExpressions {
    constructor() {
        this.nameID = this.valueID = 0;
        this.nameMap = new Map();
        this.valueMap = new Map();
    }
    addName(attribute) {
        var _a;
        let expression = this.nameMap.get(attribute);
        if (!expression) {
            expression = `${NAME_PREFIX}${this.nameID++}`;
            this.names = (_a = this.names) !== null && _a !== void 0 ? _a : {};
            this.names[expression] = attribute;
            this.nameMap.set(attribute, expression);
        }
        return expression;
    }
    addValue(attribute) {
        var _a;
        let expression = this.valueMap.get(attribute);
        if (!expression) {
            expression = `${VALUE_PREFIX}${this.valueID++}`;
            this.values = (_a = this.values) !== null && _a !== void 0 ? _a : {};
            this.values[expression] = attribute;
            this.valueMap.set(attribute, expression);
        }
        return expression;
    }
}
exports.AttributeExpressions = AttributeExpressions;
