import fs from 'fs'

import { ToolError, logError } from './errors'
import { loadSchema,  loadAndMergeQueryDocuments } from './loading'
import { validateQueryDocument } from './validation'
import { compileToIR, stringifyIR } from './compilation'
import { generateSwiftSource } from './swift'
import { generateJavaSource } from './java'

export default function generate(inputPaths, schemaPath, outputPath, target, options) {
  const schema = loadSchema(schemaPath);

  const document = loadAndMergeQueryDocuments(inputPaths);

  validateQueryDocument(schema, document);

  const context = compileToIR(schema, document);
  Object.assign(context, options);

  let output;
  switch (target) {
    case 'json':
      output = generateIR(context);
      break;
    case 'java':
      output = generateJavaSource(context);
      break;
    default:
      output = generateSwiftSource(context);
      break;
  }

  if (outputPath) {
    fs.writeFileSync(outputPath, output);
  } else {
    console.log(output);
  }
}

function generateIR(context) {
  return stringifyIR({
    operations: Object.values(context.operations),
    fragments: Object.values(context.fragments),
    typesUsed: context.typesUsed
  }, '\t');
}
