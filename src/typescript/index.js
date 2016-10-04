import { camelCase, pascalCase } from 'change-case';

import {
  join,
  block,
  wrap,
  indent
} from '../utilities/printing';

import { escapedString, multilineString } from './strings'
import { typeNameFromGraphQLType, typeDeclarationForGraphQLType } from './types';
import { typeDeclarationForOperation } from './operations'
import { typeDeclarationForFragment } from './fragments'

export function generateSource(context) {
  const operations = context.compileOperations();
  const fragments = context.compileFragments();

  const typeDeclarations = context.typesUsed.map(typeDeclarationForGraphQLType);
  const operationTypeDeclarations = operations.map(typeDeclarationForOperation);
  const fragmentTypeDeclarations = fragments.map(typeDeclarationForFragment);

  return join([
    '//  This file was automatically generated and should not be edited.\n\n',
    wrap('\n', join(typeDeclarations, '\n\n'), '\n'),
    wrap('\n', join(operationTypeDeclarations, '\n\n'), '\n'),
    wrap('\n', join(fragmentTypeDeclarations, '\n\n'), '\n')
  ]);
}
