import validatePath from './validate';

interface MainOptions {
  output: string;
  packageJson: string;
  excludeDev: boolean;
}

const main = (options: MainOptions) => {
  validatePath(options.output, options.packageJson);
};

export default main;
