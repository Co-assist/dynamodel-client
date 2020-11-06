export function pickKeys<T extends { [key: string]: any }>(item: T, keys: (keyof T)[]): T {
  return keys.reduce((newItem, key) => {
    if (key in item) {
      newItem[key] = item[key];
    }
    return newItem;
  }, {} as T);
}

export function omitKeys<T extends { [key: string]: any }>(item: T, keys: (keyof T)[]): T {
  return pickKeys(
    item,
    Object.keys(item).filter((key) => !keys.includes(key)),
  );
}

export function distinct<T>(array: T[]): T[] {
  return array.filter((elem, index) => array.indexOf(elem) === index);
}

export function splitArray<T>(array: T[], length: number): T[][] {
  const arrayList = [];
  let i = 0;
  while (i < array.length) {
    arrayList.push(array.slice(i, (i += length)));
  }
  return arrayList;
}

export function flatArray<T>(arrayList: T[][]): T[] {
  return arrayList.reduce((flattedArray, array) => flattedArray.concat(array), []);
}

export function setToArray<V>(set: Set<V>): V[] {
  const array: V[] = [];
  set.forEach((value) => array.push(value));
  return array;
}

export function mapToArray<K, V>(map: Map<K, V>): [K, V][] {
  const array: [K, V][] = [];
  map.forEach((value, key) => array.push([key, value]));
  return array;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((sum, nb) => sum + nb, 0);
}

export function isDefine<V>(value: V | undefined | null): value is V {
  return value != null;
}
