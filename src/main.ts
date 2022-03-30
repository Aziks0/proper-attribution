import validatePath from './validate';
import { getDevDependencies } from './analyse-package';
import startAnalyse from './analyse-packages';
import * as p from 'path';

interface MainOptions {
  output: string;
  packageJson: string;
  excludeDev: boolean;
}

const main = (options: MainOptions) => {
  validatePath(options.output, options.packageJson);

  let excludedDependencies: string[] | null = null;
  if (options.excludeDev)
    excludedDependencies = getDevDependencies(options.packageJson);

  const rootDirPath = p.dirname(options.packageJson);
  startAnalyse(rootDirPath, options.output, excludedDependencies);
};

export default main;
