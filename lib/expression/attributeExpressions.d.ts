import { AttributeMap } from '../client';
import { Value } from './expression';
export declare class AttributeExpressions {
    names: AttributeMap | undefined;
    values: AttributeMap | undefined;
    private nameID;
    private valueID;
    private nameMap;
    private valueMap;
    constructor();
    addName(attribute: string): string;
    addValue(attribute: Value): string;
}
