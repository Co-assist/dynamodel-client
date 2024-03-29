import { ModelSchemaSymbol, Schema } from './schema';
import { AttributeMap } from './client';
import { Table } from './table';
export declare function model<T>(schema: Schema<T>): ModelConstructor<T>;
export declare function isModel(item: any): item is Model;
export declare function toModel(item: any, table: Table): Model;
export type ModelConstructor<T extends AttributeMap = AttributeMap> = new (item: T) => Model<T>;
export type Model<T extends AttributeMap = AttributeMap> = T & {
    [ModelSchemaSymbol]: Schema<T>;
    toJSON(): T;
};
