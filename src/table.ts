import { ModelConstructor, isModel } from './model';
import { getSchema } from './schema';

export interface TableSchema {
  indexes?: Table.Indexes;
  models: ModelConstructor<any>[];
  name: string;
  primaryKey: Table.Index;
}

export namespace Table {
  export interface Indexes {
    [name: string]: Index;
  }

  export interface Index {
    hash: string;
    sort?: string;
  }
}

export class Table {
  #primaryKeyPaths!: string[];

  constructor(private schema: TableSchema) { }

  get primaryKey(): Table.Index {
    return this.schema.primaryKey;
  }

  get primaryKeyNames(): string[] {
    if (!this.#primaryKeyPaths) {
      this.#primaryKeyPaths = Object.values(this.schema.primaryKey);
    }
    return this.#primaryKeyPaths;
  }

  get constructors(): ModelConstructor<any>[] {
    return this.schema.models;
  }

  getName(stage?: string) {
    return stage ? `${stage}-${this.schema.name}` : this.schema.name;
  }

  getIndex(indexName: string): Table.Index {
    const index = this.schema.indexes?.[indexName];
    if (!index) {
      throw new Error(`Index '${indexName}' not found in the table '${this.schema.name}'`);
    }
    return index;
  }

  getModelConstructor(item: any): ModelConstructor {
    let constructor: ModelConstructor | undefined;
    if (isModel(item)) {
      constructor = item.constructor as ModelConstructor;
      if (!this.containsConstructor(constructor)) {
        throw new Error(`'${constructor.name}' is not supported in the table '${this.schema.name}', on item ${JSON.stringify(item)}`);
      }
    } else {
      const primaryKeyNames = this.primaryKeyNames;
      constructor = this.constructors.find((constructor) => this.matchConstructor(item, constructor, primaryKeyNames));
      if (!constructor) {
        throw new Error(`No constructor found in the table '${this.schema.name}', on item ${JSON.stringify(item)}`);
      }
    }
    return constructor;
  }

  private containsConstructor(constructor: ModelConstructor): boolean {
    return this.constructors.includes(constructor);
  }

  private matchConstructor(item: any, constructor: ModelConstructor, keys: string[]): boolean {
    const schema = getSchema(constructor);
    return keys.every((key) => schema.getAttributeSchema(key)!.test(item[key], [key], item) || false);
  }
}
