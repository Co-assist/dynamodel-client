import { ModelConstructor } from './model';
export interface TableSchema {
    indexes?: Table.Indexes;
    models: ModelConstructor<any>[];
    name: string;
    primaryKey: Table.Index;
    modelKey?: Table.ModelKey;
}
export declare namespace Table {
    interface Indexes {
        [name: string]: Index;
    }
    interface Index {
        hash: string;
        sort?: string;
    }
    interface ModelKey {
        path: string;
    }
}
export declare class Table {
    #private;
    private schema;
    constructor(schema: TableSchema);
    get primaryKey(): Table.Index;
    get primaryKeyNames(): string[];
    get constructors(): ModelConstructor<any>[];
    get modelKey(): Table.ModelKey | undefined;
    getName(stage?: string): string;
    getIndex(indexName: string): Table.Index;
    getModelConstructor(item: any): ModelConstructor;
    private containsConstructor;
    private matchConstructor;
}
