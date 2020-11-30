export declare function pickKeys<T extends {
    [key: string]: any;
}>(item: T, keys: (keyof T)[]): T;
export declare function omitKeys<T extends {
    [key: string]: any;
}>(item: T, keys: (keyof T)[]): T;
export declare function distinct<T>(array: T[]): T[];
export declare function splitArray<T>(array: T[], length: number): T[][];
export declare function flatArray<T>(arrayList: T[][]): T[];
export declare function setToArray<V>(set: Set<V>): V[];
export declare function mapToArray<K, V>(map: Map<K, V>): [K, V][];
export declare function sum(numbers: number[]): number;
export declare function isDefine<V>(value: V | undefined | null): value is V;
