import {
  GraphQLNonNull
} from 'graphql'

import { camelCase, pascalCase } from 'change-case';

import {
  join,
  wrap,
} from '../utilities/printing';

import {
  interfaceDeclaration,
  structDeclaration,
  interfacePropertyDeclaration,
  propertyDeclaration,
  propertyDeclarations
} from './declarations';

import { escapedString, multilineString } from './strings';

import {
  typeNameFromGraphQLType,
  typeDeclarationForGraphQLType
} from './types';

import {
  propertyFromField,
  propertiesFromFields
} from './properties';

import { protocolNameForFragmentName } from './fragments';

export function classDeclarationForOperation(generator,
    { operationName, variables = [], fields = [], source = '', fragmentsReferenced }) {
  const className = `${pascalCase(operationName)}Query`;

  interfaceDeclaration(generator, {
    name: className,
  }, () => {

    const properties = propertiesFromFields(fields);

    properties.filter(property => !property.isComposite).forEach(property => 
      interfacePropertyDeclaration(generator, property)
    );
    properties.filter(property => property.isComposite).forEach(property => 
      structDeclarationForProperty(generator, property)
    );
  });
}

export function initializerDeclarationForVariables(generator, variables) {
  generator.printOnNewline(`public init`);

  generator.print('(');
  generator.print(join(variables.map(({ name, type }) =>
    join([
      `${name}: ${typeNameFromGraphQLType(type)}`,
      !(type instanceof GraphQLNonNull) && ' = nil'
    ])
  ), ', '));
  generator.print(')');

  generator.withinBlock(() => {
    variables.forEach(({ name }) => {
      generator.printOnNewline(`self.${name} = ${name}`);
    });
  });
}

export function variablesProperty(generator, variables) {
  generator.printOnNewline('public var variables: GraphQLMap?');
  generator.withinBlock(() => {
    generator.printOnNewline(wrap(
      `return [`,
      join(variables.map(({ name }) => `"${name}": ${name}`), ', '),
      `]`
    ));
  });
}

export function structDeclarationForProperty(generator,
    { name, bareTypeName, fragmentSpreads = [], properties = [] }) {
  const adoptedProtocols = ['GraphQLMapConvertible', ...fragmentSpreads.map(protocolNameForFragmentName)];

  structDeclaration(generator, { name, adoptedProtocols }, () => {
    propertyDeclarations(generator, properties);
  });
  
  generator.print(';');
}

export function initializationForProperty(generator, { name, fieldName, isOptional, isList }) {
  const methodName = isOptional ? (isList ? 'optionalList' : 'optionalValue') : (isList ? 'list' : 'value');

  const args = [`forKey: "${fieldName}"`];

  generator.printOnNewline(`${name} = try map.${methodName}(${ join(args, ', ') })`);
}
