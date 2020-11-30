import { ModelSchemaSymbol, getSchema, Schema } from './schema';
import { AttributeMap } from './client';
import { Table } from './table';

export function model<T>(schema: Schema<T>): ModelConstructor<T> {
  // @ts-ignore - cast as Model<T>
  return class ModelImpl implements Model<T> {
    [attributeName: string]: any;

    constructor(item: T) {
      Object.assign(this, item);
    }

    get [ModelSchemaSymbol](): Schema<T> {
      return schema;
    }

    toJSON(): T {
      return this[ModelSchemaSymbol].toJSON(this);
    }
  };
}

export function isModel(item: any): item is Model {
  return getSchema(item) !== undefined;
}

export function toModel(item: any, table: Table): Model {
  const ModelConstructor = table.getModelConstructor(item);
  return new ModelConstructor(item);
}

export type ModelConstructor<T extends AttributeMap = AttributeMap> = new (item: T) => Model<T>;

export type Model<T extends AttributeMap = AttributeMap> = T & {
  [ModelSchemaSymbol]: Schema<T>;
  toJSON(): T;
};
