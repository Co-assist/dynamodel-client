import { AttributeMap } from './client';
export declare const ModelSchemaSymbol: unique symbol;
export declare class Schema<T extends AttributeMap = AttributeMap> {
    readonly json: ModelSchema<T>;
    constructor(json: ModelSchema<T>);
    /** @override */
    getAttributeSchema(attributeName: string): AttributeSchema | undefined;
    /** @override */
    validate(object: any): void;
    /** @override */
    validatePath(object: any, path: (number | string)[]): void | never;
    /** @override */
    toJSON(object: any): T;
}
export declare class Schemaless<T extends AttributeMap = AttributeMap> extends Schema<T> {
    private static readonly ATTRIBUTE_SCHEMA;
    /** @override */
    getAttributeSchema(attributeName: string): AttributeSchema;
    /** @override */
    toJSON(object: any): T;
}
export declare function getSchema(object: any): Schema;
export declare function getSafeSchema(object: any): Schema;
export declare type ModelSchema<T extends AttributeMap = AttributeMap> = {
    [K in keyof Required<T>]: AttributeSchema;
};
export declare type AttributeSchema = {
    test: (value: any, path: (string | number)[], source: any) => boolean;
};
