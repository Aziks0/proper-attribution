import { Command } from 'commander';
import main from './main';

const program = new Command();

program
  .name('proper-attribution')
  .description(
    'Give a proper attribution to the authors of the packages you use'
  )
  .version('1.0.0');

program
  .option(
    '-o, --output <path>',
    'change the output filename and directory',
    'NOTICE' // defaults to `./NOTICE`
  )
  .option(
    '--package-json <path>',
    'specify a `package.json` path',
    'package.json' // defaults to `./package.json`
  )
  .option('-D, --exclude-dev', 'exclude dev dependencies', false)
  .action(main);

program.parse();
