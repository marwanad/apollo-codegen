import fs from 'fs'

import { ToolError, logError } from './errors'
import { loadSchema,  loadAndMergeQueryDocuments } from './loading'
import { validateQueryDocument } from './validation'
import { Compiler, stringifyIR } from './compilation'
import { generateSource as generateSwiftSource } from './swift'
import { generateSource as generateTypeScriptSource } from './typescript'

export default function generate(inputPaths, schemaPath, outputPath, target) {
  const schema = loadSchema(schemaPath);

  const document = loadAndMergeQueryDocuments(inputPaths);

  validateQueryDocument(schema, document);

  const context = new Compiler(schema, document);

  let output = null;

  switch (target ? target.toLowerCase() : 'swift') {
    case 'json': {
      output = generateIR(context);
      break;
    }
    case 'ts': {
      output = generateTypeScriptSource(context);
      break;
    }
    case 'swift':
    default: {
      output = generateSwiftSource(context);
      break;
    }
  }

  fs.writeFileSync(outputPath, output);
}

function generateIR(context) {
  return stringifyIR({
    operations: context.operations.map(operation => context.compileOperation(operation)),
    fragments: context.fragments.map(fragment => context.compileFragment(fragment)),
  }, '\t');
}
