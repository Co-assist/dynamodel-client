import { mapToArray, setToArray } from '../util/objectUtils';
import { Expression, PathExpression, ValueExpression, FunctionExpression, ExpressionContext } from './expression';

export type UpdateExpression = BinaryOperationExpression | IfNotExistsExpression | ListAppendExpression;

export type AddExpression = ValueExpression<Set<any> | number> | UpdateExpression;
export type DeleteExpression = ValueExpression<Set<any>> | UpdateExpression;
export type RemoveExpression = PathExpression;
export type SetExpression = ValueExpression<any> | UpdateExpression;

export function ifNotExists(path: PathExpression, value: UpdateExpression | PathExpression | ValueExpression) {
  return new IfNotExistsExpression(path, value);
}

export function listAppend(
  list1: UpdateExpression | PathExpression | ValueExpression,
  list2: UpdateExpression | PathExpression | ValueExpression,
) {
  return new ListAppendExpression(list1, list2);
}

export function addition(
  operand1: BinaryOperationExpression['operand1'],
  operand2: BinaryOperationExpression['operand2'],
) {
  return new BinaryOperationExpression('+', operand1, operand2);
}

export function substraction(
  operand1: BinaryOperationExpression['operand1'],
  operand2: BinaryOperationExpression['operand2'],
) {
  return new BinaryOperationExpression('-', operand1, operand2);
}

export class Updatable implements Expression {
  readonly addMap: Map<PathExpression, AddExpression>;
  readonly deleteMap: Map<PathExpression, DeleteExpression>;
  readonly removeSet: Set<RemoveExpression>;
  readonly setMap: Map<PathExpression, SetExpression>;

  constructor() {
    this.addMap = new Map();
    this.deleteMap = new Map();
    this.removeSet = new Set();
    this.setMap = new Map();
  }

  add(path: PathExpression, value: AddExpression): this {
    this.addMap.set(path, value);
    return this;
  }

  delete(path: PathExpression, value: DeleteExpression): this {
    this.deleteMap.set(path, value);
    return this;
  }

  remove(path: PathExpression): this {
    this.removeSet.add(path);
    return this;
  }

  set(path: PathExpression, value: SetExpression): this {
    this.setMap.set(path, value);
    return this;
  }

  /** @override */
  serialize(context: ExpressionContext): string {
    const expressions = [
      this.serializeAdd(context),
      this.serializeDelete(context),
      this.serializeRemove(context),
      this.serializeSet(context),
    ];
    return expressions.filter((expression) => expression !== undefined).join(' ');
  }

  private serializeAdd(context: ExpressionContext) {
    if (this.addMap.size === 0) {
      return undefined;
    }
    const expression = mapToArray(this.addMap)
      .map(([path, value]) => {
        const pathExpression = path.serialize(context);
        const valueExpression = value.serialize(context);
        return `${pathExpression} ${valueExpression}`;
      })
      .join(', ');
    return `ADD ${expression}`;
  }

  private serializeDelete(context: ExpressionContext) {
    if (this.deleteMap.size === 0) {
      return undefined;
    }
    const expression = mapToArray(this.deleteMap)
      .map(([path, subset]) => {
        const pathExpression = path.serialize(context);
        const subsetExpression = subset.serialize(context);
        return `${pathExpression} ${subsetExpression}`;
      })
      .join(', ');
    return `DELETE ${expression}`;
  }

  private serializeRemove(context: ExpressionContext) {
    if (this.removeSet.size === 0) {
      return undefined;
    }
    const expression = setToArray(this.removeSet)
      .map((path) => path.serialize(context))
      .join(', ');
    return `REMOVE ${expression}`;
  }

  private serializeSet(context: ExpressionContext) {
    if (this.setMap.size === 0) {
      return undefined;
    }
    const expression = mapToArray(this.setMap)
      .map(([path, value]) => {
        const pathExpression = path.serialize(context);
        const valueExpression = value.serialize(context);
        return `${pathExpression} = ${valueExpression}`;
      })
      .join(', ');
    return `SET ${expression}`;
  }
}

class BinaryOperationExpression implements Expression {
  constructor(
    private operator: string,
    private operand1: UpdateExpression | PathExpression | ValueExpression,
    private operand2: UpdateExpression | PathExpression | ValueExpression,
  ) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const operand1Expression = this.operand1.serialize(context);
    const operand2Expression = this.operand2.serialize(context);
    return `${operand1Expression} ${this.operator} ${operand2Expression}`;
  }
}

class IfNotExistsExpression extends FunctionExpression {
  constructor(path: PathExpression, value: UpdateExpression | PathExpression | ValueExpression) {
    super('if_not_exists', [path, value]);
  }
}

class ListAppendExpression extends FunctionExpression {
  constructor(
    list1: UpdateExpression | PathExpression | ValueExpression,
    list2: UpdateExpression | PathExpression | ValueExpression,
  ) {
    super('list_append', [list1, list2]);
  }
}
