import { PathExpression, ValueExpression, Expression, FunctionExpression, ExpressionContext } from './expression';

export function equals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('=', operand1, operand2);
}

export function notEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('<>', operand1, operand2);
}

export function greaterThan(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('>', operand1, operand2);
}

export function greaterEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('>=', operand1, operand2);
}

export function lowerThan(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('<', operand1, operand2);
}

export function lowerEquals(operand1: ComparisonExpression['operand1'], operand2: ComparisonExpression['operand2']) {
  return new ComparisonExpression('<=', operand1, operand2);
}

export function and(...conditions: BooleanConditionExpression[]) {
  return new LogicalExpression(
    'AND',
    conditions.filter((condition) => !!condition),
  );
}

export function or(...conditions: BooleanConditionExpression[]) {
  return new LogicalExpression(
    'OR',
    conditions.filter((condition) => !!condition),
  );
}

export function attributeExists(path: PathExpression) {
  return new FunctionBooleanExpression('attribute_exists', [path]);
}

export function attributeNotExists(path: PathExpression) {
  return new FunctionBooleanExpression('attribute_not_exists', [path]);
}

export function attributeType(path: PathExpression, type: ValueExpression<AttributeType>) {
  return new FunctionBooleanExpression('attribute_type', [path, type]);
}

export function contains(path: PathExpression, operand: PathExpression | ValueExpression) {
  return new FunctionBooleanExpression('contains', [path, operand]);
}

export function size(path: PathExpression) {
  return new FunctionNumberExpression('size', [path]);
}

export function beginsWith(path: PathExpression, substring: ValueExpression<string>) {
  return new FunctionBooleanExpression('begins_with', [path, substring]);
}

export function not(condition: NotExpression['condition']) {
  return new NotExpression(condition);
}

export function between(
  value: BetweenExpression['value'],
  lowerBound: BetweenExpression['lowerBound'],
  upperBound: BetweenExpression['upperBound'],
) {
  return new BetweenExpression(value, lowerBound, upperBound);
}

export function inList(operand: InListExpression['operand'], values: (PathExpression | ValueExpression)[]) {
  return new InListExpression(operand, values);
}

export type AttributeType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M';

export type ConditionExpression = BooleanConditionExpression | NumberConditionExpression;

type BooleanConditionExpression =
  | ComparisonExpression
  | FunctionBooleanExpression
  | LogicalExpression
  | BetweenExpression
  | InListExpression
  | NotExpression;

type NumberConditionExpression = FunctionNumberExpression;

class ComparisonExpression implements Expression {
  constructor(
    private operator: string,
    private operand1: ConditionExpression | PathExpression | ValueExpression,
    private operand2: ConditionExpression | PathExpression | ValueExpression,
  ) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const operand1Expression = this.operand1.serialize(context);
    const operand2Expression = this.operand2.serialize(context);
    return `${operand1Expression} ${this.operator} ${operand2Expression}`;
  }
}

class FunctionBooleanExpression extends FunctionExpression {
  constructor(functionName: string, params: Expression[]) {
    super(functionName, params);
  }
}

class FunctionNumberExpression extends FunctionExpression {
  constructor(functionName: string, params: Expression[]) {
    super(functionName, params);
  }
}

class LogicalExpression implements Expression {
  constructor(
    private operator: string,
    private conditions: BooleanConditionExpression[],
  ) {
    if (conditions.length === 0) {
      // Prevent "()" serialized expression.
      throw new Error('LogicalExpression must contains at least one condition.');
    }
  }

  /** @override */
  serialize(context: ExpressionContext): string {
    const conditionsExpression = this.conditions
      .map((condition) => condition.serialize(context))
      .join(` ${this.operator} `);
    return `(${conditionsExpression})`;
  }
}

class NotExpression implements Expression {
  constructor(private condition: BooleanConditionExpression) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const conditionExpression = this.condition.serialize(context);
    return `NOT (${conditionExpression})`;
  }
}

class BetweenExpression implements Expression {
  constructor(
    private value: PathExpression | NumberConditionExpression | ValueExpression<number>,
    private lowerBound: PathExpression | NumberConditionExpression | ValueExpression<number>,
    private upperBound: PathExpression | NumberConditionExpression | ValueExpression<number>,
  ) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const valueExpression = this.value.serialize(context);
    const lowerBoundExpression = this.lowerBound.serialize(context);
    const upperBoundExpression = this.upperBound.serialize(context);
    return `${valueExpression} BETWEEN ${lowerBoundExpression} AND ${upperBoundExpression}`;
  }
}

class InListExpression implements Expression {
  constructor(
    private operand: ConditionExpression | PathExpression,
    private values: (PathExpression | ValueExpression)[],
  ) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const operandExpression = this.operand.serialize(context);
    const valuesExpression = this.values.map((value) => value.serialize(context)).join(', ');
    return `${operandExpression} IN (${valuesExpression})`;
  }
}
