import { camelCase, pascalCase } from 'change-case';

import {
  join,
  block,
  wrap,
  indent
} from '../utilities/printing';

import { multilineString } from './strings'
import { propertiesFromFields } from './properties'

export function typeDeclarationForFragment({ fragmentName, fields, source }) {
  const protocolName = protocolNameForFragmentName(fragmentName);
  const className = `${protocolName}Fragment`;
  const properties = propertiesFromFields(fields);

  return join([
    `export type ${className} =`,
    block(properties.map(({ name, typeName }) =>
      `${name}: ${typeName},`
    ))
  ]);
}

export function protocolNameForFragmentName(fragmentName) {
  return pascalCase(fragmentName);
}
