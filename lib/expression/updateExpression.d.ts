import { Expression, PathExpression, ValueExpression, FunctionExpression, ExpressionContext } from './expression';
export declare type UpdateExpression = BinaryOperationExpression | IfNotExistsExpression | ListAppendExpression;
export declare type AddExpression = ValueExpression<Set<any> | number> | UpdateExpression;
export declare type DeleteExpression = ValueExpression<Set<any>> | UpdateExpression;
export declare type RemoveExpression = PathExpression;
export declare type SetExpression = ValueExpression<any> | UpdateExpression;
export declare function ifNotExists(path: PathExpression, value: UpdateExpression | PathExpression | ValueExpression): IfNotExistsExpression;
export declare function listAppend(list1: UpdateExpression | PathExpression | ValueExpression, list2: UpdateExpression | PathExpression | ValueExpression): ListAppendExpression;
export declare function addition(operand1: BinaryOperationExpression['operand1'], operand2: BinaryOperationExpression['operand2']): BinaryOperationExpression;
export declare function substraction(operand1: BinaryOperationExpression['operand1'], operand2: BinaryOperationExpression['operand2']): BinaryOperationExpression;
export declare class Updatable implements Expression {
    readonly addMap: Map<PathExpression, AddExpression>;
    readonly deleteMap: Map<PathExpression, DeleteExpression>;
    readonly removeSet: Set<RemoveExpression>;
    readonly setMap: Map<PathExpression, SetExpression>;
    constructor();
    add(path: PathExpression, value: AddExpression): this;
    delete(path: PathExpression, value: DeleteExpression): this;
    remove(path: PathExpression): this;
    set(path: PathExpression, value: SetExpression): this;
    /** @override */
    serialize(context: ExpressionContext): string;
    private serializeAdd;
    private serializeDelete;
    private serializeRemove;
    private serializeSet;
}
declare class BinaryOperationExpression implements Expression {
    private operator;
    private operand1;
    private operand2;
    constructor(operator: string, operand1: UpdateExpression | PathExpression | ValueExpression, operand2: UpdateExpression | PathExpression | ValueExpression);
    /** @override */
    serialize(context: ExpressionContext): string;
}
declare class IfNotExistsExpression extends FunctionExpression {
    constructor(path: PathExpression, value: UpdateExpression | PathExpression | ValueExpression);
}
declare class ListAppendExpression extends FunctionExpression {
    constructor(list1: UpdateExpression | PathExpression | ValueExpression, list2: UpdateExpression | PathExpression | ValueExpression);
}
export {};
