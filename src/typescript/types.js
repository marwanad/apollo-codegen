import {
  join,
  block,
  wrap,
  indent
} from '../utilities/printing';

import { camelCase } from 'change-case';

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql';

export function typeNameFromGraphQLType(type, bareTypeName, nullable = true) {
  if (type instanceof GraphQLNonNull) {
    return typeNameFromGraphQLType(type.ofType, bareTypeName, false)
  }

  let typeName;
  if (type instanceof GraphQLList) {
    typeName = 'Array<' + typeNameFromGraphQLType(type.ofType, bareTypeName, true) + '>';
  } else if (type === GraphQLID) {
    typeName = 'GraphQLID'
  } else {
    typeName = bareTypeName || type.name;
  }

  return nullable ? typeName + ' | null' : typeName;
}

export function typeDeclarationForGraphQLType(generator, type) {
  if (type instanceof GraphQLEnumType) {
    return enumerationDeclaration(generator, type);
  }
}

function enumerationDeclaration(generator, type) {
  const { name, description } = type;
  const values = type.getValues();

  generator.printNewlineIfNeeded();
  generator.printOnNewline(description && `// ${description}`);
  generator.printOnNewline(`export type ${name} =`);
  values.forEach((value, i) =>
    generator.printOnNewline(`  '${value.value}'${i === values.length - 1 ? ';' : ' |'}${wrap(' // ', value.description)}`)
  );
}
