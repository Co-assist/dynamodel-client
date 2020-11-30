import { AttributeMap } from './client';

export const ModelSchemaSymbol = Symbol('ModelSchema');

export class Schema<T extends AttributeMap = AttributeMap> {
  constructor(readonly json: ModelSchema<T>) {
    if (!this.json) {
      throw new Error('Empty schema');
    }
  }

  /** @override */
  getAttributeSchema(attributeName: string): AttributeSchema | undefined {
    return this.json[attributeName];
  }

  /** @override */
  validate(object: any) {
    for (const attributeName in this.json) {
      this.validatePath(object, [attributeName]);
    }
  }

  /** @override */
  validatePath(object: any, path: (number | string)[]): void | never {
    const [attributeName] = path;
    const attributeSchema = this.getAttributeSchema(attributeName as string);
    if (attributeSchema?.test(object[attributeName], path, object) !== true) {
      throw new Error(`Invalid value for the path '${path.join(', ')}'`);
    }
  }

  /** @override */
  toJSON(object: any): T {
    const json: Partial<T> = {};
    for (const key in this.json) {
      if (object[key] !== undefined) {
        json[key] = object[key];
      }
    }
    return json as T;
  }
}

export class Schemaless<T extends AttributeMap = AttributeMap> extends Schema<T> {
  private static readonly ATTRIBUTE_SCHEMA: AttributeSchema = {
    test: () => true,
  };

  /** @override */
  getAttributeSchema(attributeName: string): AttributeSchema {
    return super.getAttributeSchema(attributeName) ?? Schemaless.ATTRIBUTE_SCHEMA;
  }

  /** @override */
  toJSON(object: any) {
    const json = super.toJSON(object);
    for (const key in object) {
      if (!(key in json)) {
        json[key as keyof T] = object[key];
      }
    }
    return json;
  }
}

export function getSchema(object: any): Schema {
  return object[ModelSchemaSymbol] || object.prototype?.[ModelSchemaSymbol];
}

export function getSafeSchema(object: any): Schema {
  const schema = getSchema(object);
  if (!schema) {
    throw new Error('No schema found for the given object');
  }
  return schema;
}

export type ModelSchema<T extends AttributeMap = AttributeMap> = {
  [K in keyof Required<T>]: AttributeSchema;
};

export type AttributeSchema = {
  test: (value: any, path: (string | number)[], source: any) => boolean;
};
