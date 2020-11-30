import { PathExpression, ExpressionContext } from './expression';
export declare function serializeProjection(projection: Projection | undefined, context: ExpressionContext): string;
export declare type Projection = PathExpression[];
