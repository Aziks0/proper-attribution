#!/usr/bin/env node

import { Command } from 'commander';
import main from './main';

const program = new Command();

const description = `Give a proper attribution to the authors of the packages you use.


-- INFORMATION --

A file will be created, it will contain the information necessary to give
attribution to the authors of the packages you use.

The information of the packages are:
  - name
  - version
  - homepage url
  - repository url
  - author
  - contributors
  - license type
  - copy of the license and copyright notice

This information is taken from the \`node_modules\` folder, so for this program
to work, all the packages your program uses must be installed, so make sure the
\`node_modules\` folder is present. If it is not, run \`(npm|pnpm) install\`.

Packages that you have previously uninstalled/removed may still be present in
the \`node_modules\` folder. These packages will be then added to the notice
file. To avoid this, you must run \`(npm|pnpm) prune\` before running this
program.
`;

program.name('proper-attribution').description(description).version('1.0.0');

program
  .option(
    '-o, --output <path>',
    'change the output filename and directory',
    'NOTICE.md' // defaults to `./NOTICE.md`
  )
  .option(
    '--package-json <path>',
    'specify a `package.json` path',
    'package.json' // defaults to `./package.json`
  )
  .option('-D, --exclude-dev', 'exclude dev dependencies', false)
  .action(main);

program.parse();
