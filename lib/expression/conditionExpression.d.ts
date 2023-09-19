import { PathExpression, ValueExpression, Expression, FunctionExpression, ExpressionContext } from './expression';
export declare function equals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function notEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function greaterThan(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function greaterEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function lowerThan(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function lowerEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']): ComparisonExpression;
export declare function and(...conditions: BooleanConditionExpression[]): LogicalExpression;
export declare function or(...conditions: BooleanConditionExpression[]): LogicalExpression;
export declare function attributeExists(path: PathExpression): FunctionBooleanExpression;
export declare function attributeNotExists(path: PathExpression): FunctionBooleanExpression;
export declare function attributeType(path: PathExpression, type: ValueExpression<AttributeType>): FunctionBooleanExpression;
export declare function contains(path: PathExpression, operand: PathExpression | ValueExpression): FunctionBooleanExpression;
export declare function size(path: PathExpression): FunctionNumberExpression;
export declare function beginsWith(path: PathExpression, substring: ValueExpression<string>): FunctionBooleanExpression;
export declare function not(condition: NotExpression['condition']): NotExpression;
export declare function between(value: BetweenExpression['value'], lowerBound: BetweenExpression['lowerBound'], upperBound: BetweenExpression['upperBound']): BetweenExpression;
export declare function inList(operand: InListExpression['operand'], values: (PathExpression | ValueExpression)[]): InListExpression;
export declare type AttributeType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M';
export declare type ConditionExpression = BooleanConditionExpression | NumberConditionExpression;
declare type BooleanConditionExpression = ComparisonExpression | FunctionBooleanExpression | LogicalExpression | BetweenExpression | InListExpression | NotExpression;
declare type NumberConditionExpression = FunctionNumberExpression;
declare class ComparisonExpression implements Expression {
    private operator;
    private operand1;
    private operand2;
    constructor(operator: string, operand1: ConditionExpression | PathExpression | ValueExpression, operand2: ConditionExpression | PathExpression | ValueExpression);
    /** @override */
    serialize(context: ExpressionContext): string;
}
declare class FunctionBooleanExpression extends FunctionExpression {
    constructor(functionName: string, params: Expression[]);
}
declare class FunctionNumberExpression extends FunctionExpression {
    constructor(functionName: string, params: Expression[]);
}
declare class LogicalExpression implements Expression {
    private operator;
    private conditions;
    constructor(operator: string, conditions: BooleanConditionExpression[]);
    /** @override */
    serialize(context: ExpressionContext): string;
}
declare class NotExpression implements Expression {
    private condition;
    constructor(condition: BooleanConditionExpression);
    /** @override */
    serialize(context: ExpressionContext): string;
}
declare class BetweenExpression implements Expression {
    private value;
    private lowerBound;
    private upperBound;
    constructor(value: PathExpression | NumberConditionExpression | ValueExpression<number>, lowerBound: PathExpression | NumberConditionExpression | ValueExpression<number>, upperBound: PathExpression | NumberConditionExpression | ValueExpression<number>);
    /** @override */
    serialize(context: ExpressionContext): string;
}
declare class InListExpression implements Expression {
    private operand;
    private values;
    constructor(operand: ConditionExpression | PathExpression, values: (PathExpression | ValueExpression)[]);
    /** @override */
    serialize(context: ExpressionContext): string;
}
export {};
