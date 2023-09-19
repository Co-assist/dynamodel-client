import { AttributeExpressions } from './attributeExpressions';
import { Table } from '../table';
export declare function path(attribute: string, ...subAttribute: (string | number)[]): PathExpression;
export declare function value<T>(value: T): ValueExpression;
export declare function hashKey(): HashKeyExpression;
export declare function sortKey(): SortKeyExpression;
export type Path = string | (string | number)[];
export type Value<T = any> = T;
export interface Expression {
    serialize(context: ExpressionContext): string;
}
export interface ExpressionContext {
    attributes: AttributeExpressions;
    table: Table;
    indexName?: string;
}
export declare abstract class PathExpression implements Expression {
    static cache: Map<string, PathExpression>;
    /** @override */
    abstract serialize(context: ExpressionContext): string;
}
export declare class PathArrayExpression extends PathExpression {
    private attributeName;
    private subAttributes;
    constructor(path: (number | string)[]);
    /** @override */
    serialize(context: ExpressionContext): string;
}
export declare class HashKeyExpression extends PathExpression {
    private static instance;
    static get(): HashKeyExpression;
    /** @override */
    serialize(context: ExpressionContext): string;
}
export declare class SortKeyExpression extends PathExpression {
    private static instance;
    static get(): SortKeyExpression;
    /** @override */
    serialize(context: ExpressionContext): string;
}
export declare class ValueExpression<T = any> implements Expression {
    private value;
    constructor(value: T);
    /** @override */
    serialize(context: ExpressionContext): string;
}
export declare class FunctionExpression implements Expression {
    private functionName;
    private params;
    constructor(functionName: string, params: Expression[]);
    /** @override */
    serialize(context: ExpressionContext): string;
}
