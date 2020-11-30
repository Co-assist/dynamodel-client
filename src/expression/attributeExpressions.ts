import { AttributeMap } from '../client';
import { Value, Path } from './expression';

const NAME_PREFIX = '#n';
const VALUE_PREFIX = ':v';

export class AttributeExpressions {
  names: AttributeMap | undefined;
  values: AttributeMap | undefined;

  private nameID: number;
  private valueID: number;
  private nameMap: Map<Path, string>;
  private valueMap: Map<Value, string>;

  constructor() {
    this.nameID = this.valueID = 0;
    this.nameMap = new Map();
    this.valueMap = new Map();
  }

  addName(attribute: string): string {
    let expression = this.nameMap.get(attribute);
    if (!expression) {
      expression = `${NAME_PREFIX}${this.nameID++}`;
      this.names = this.names ?? {};
      this.names[expression] = attribute;
      this.nameMap.set(attribute, expression);
    }
    return expression;
  }

  addValue(attribute: Value): string {
    let expression = this.valueMap.get(attribute);
    if (!expression) {
      expression = `${VALUE_PREFIX}${this.valueID++}`;
      this.values = this.values ?? {};
      this.values[expression] = attribute;
      this.valueMap.set(attribute, expression);
    }
    return expression;
  }
}
