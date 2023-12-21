import { AttributeExpressions } from './attributeExpressions';
import { Table } from '../table';

export function path(attribute: string, ...subAttribute: (string | number)[]): PathExpression {
  const path = [attribute, ...subAttribute];
  const reference = path.join('');
  let pathExpression = PathExpression.cache.get(reference);
  if (!pathExpression) {
    pathExpression = new PathArrayExpression(path);
    PathExpression.cache.set(reference, pathExpression);
  }
  return pathExpression;
}

export function value<T>(value: T): ValueExpression {
  return new ValueExpression<T>(value);
}

export function hashKey(): HashKeyExpression {
  return HashKeyExpression.get();
}

export function sortKey(): SortKeyExpression {
  return SortKeyExpression.get();
}

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

export abstract class PathExpression implements Expression {
  static cache = new Map<string, PathExpression>();

  /** @override */
  abstract serialize(context: ExpressionContext): string;
}

export class PathArrayExpression extends PathExpression {
  private attributeName: string;
  private subAttributes: (number | string)[];

  constructor(path: (number | string)[]) {
    super();
    if (typeof path[0] !== 'string') {
      throw new Error(`Path must start with an attribute name: '${path}'`);
    }
    [this.attributeName, ...this.subAttributes] = path;
  }

  /** @override */
  serialize(context: ExpressionContext): string {
    const expression = context.attributes.addName(this.attributeName);
    return this.subAttributes.reduce((expression: string, name: string | number) => {
      switch (typeof name) {
        case 'string':
          return `${expression}.${context.attributes.addName(name)}`;
        case 'number':
          return `${expression}[${context.attributes.addValue(name)}]`;
        default:
          throw new Error(`Illegal path attribute type: '${typeof name}'`);
      }
    }, expression) as string;
  }
}

export class HashKeyExpression extends PathExpression {
  private static instance: HashKeyExpression;

  static get(): HashKeyExpression {
    if (!HashKeyExpression.instance) {
      HashKeyExpression.instance = new HashKeyExpression();
    }
    return HashKeyExpression.instance;
  }

  /** @override */
  serialize(context: ExpressionContext): string {
    const table = context.table;
    const indexName = context.indexName;
    const index = indexName ? table.getIndex(indexName) : table.primaryKey;
    return context.attributes.addName(index.hash);
  }
}

export class SortKeyExpression extends PathExpression {
  private static instance: SortKeyExpression;

  static get(): SortKeyExpression {
    if (!SortKeyExpression.instance) {
      SortKeyExpression.instance = new SortKeyExpression();
    }
    return SortKeyExpression.instance;
  }

  /** @override */
  serialize(context: ExpressionContext): string {
    const table = context.table;
    const indexName = context.indexName;
    const index = indexName ? table.getIndex(indexName) : table.primaryKey;
    if (!index.sort) {
      throw new Error(
        `No sort key found for the ${
          indexName ? "index '" + indexName + "'" : 'primary key'
        } of the table '${table.getName()}'`,
      );
    }
    return context.attributes.addName(index.sort);
  }
}

export class ValueExpression<T = any> implements Expression {
  constructor(private value: T) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    return context.attributes.addValue(this.value);
  }
}

export class FunctionExpression implements Expression {
  constructor(
    private functionName: string,
    private params: Expression[],
  ) {}

  /** @override */
  serialize(context: ExpressionContext): string {
    const paramsExpression = this.params.map((param) => param.serialize(context)).join(', ');
    return `${this.functionName}(${paramsExpression})`;
  }
}
