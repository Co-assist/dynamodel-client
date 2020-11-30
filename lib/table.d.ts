import { ModelConstructor } from './model';
export interface TableSchema {
    indexes?: Table.Indexes;
    models: ModelConstructor<any>[];
    name: string;
    primaryKey: Table.Index;
}
export declare namespace Table {
    interface Indexes {
        [name: string]: Index;
    }
    interface Index {
        hash: string;
        sort?: string;
    }
}
export declare class Table {
    #private;
    private schema;
    constructor(schema: TableSchema);
    get primaryKey(): Table.Index;
    get primaryKeyNames(): string[];
    get constructors(): ModelConstructor<any>[];
    getName(stage?: string): string;
    getIndex(indexName: string): Table.Index;
    getModelConstructor(item: any): ModelConstructor;
    private containsConstructor;
    private matchConstructor;
}
