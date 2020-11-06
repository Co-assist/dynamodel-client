import { distinct } from '../util/objectUtils';
import { PathExpression, path, ExpressionContext } from './expression';

export function serializeProjection(projection: Projection | undefined, context: ExpressionContext) {
  if (!projection) {
    return undefined;
  }
  const finalProjection = distinct([...projection, ...context.table.primaryKeyNames.map((key) => path(key))]);
  return finalProjection.map((path) => path.serialize(context)).join(', ');
}

export type Projection = PathExpression[];
