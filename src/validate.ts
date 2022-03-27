import fs from 'fs';
import * as p from 'path';
import { logError } from './utils/logging';

/** Returns `void` if `error === 'ENOENT'`, exit with code 1 otherwise */
const handleLstatError = (error: any) => {
  if (error.code === 'ENOENT') return;
  logError(error);
  process.exit(1);
};

/**
 * Check if the output file is valid.
 *
 * The path is valid if:
 * - It points to an existing file
 * - It points to "something" inexistant but its dirname is a directory
 *
 * If an error, other than `ENOENT` is thrown by `fs.lstat()`, the error will be
 * logged to stderr and the process will exit with code 1
 *
 * @param path The path to the output file
 * @returns `true` if the path is valid, `false` otherwise
 */
const isValidOutputPath = (path: string) => {
  // Check if it points to an existing file
  try {
    return fs.lstatSync(path).isFile();
  } catch (error) {
    // An error is thrown if the file/dir doesn't exist, which corresponds to
    // the error `ENOENT`, and it's perfectly fine in this case. If it's
    // another error, we need to log it and exit.
    handleLstatError(error);
  }

  // Check if the dirname exist and if it is a directory
  const dirname = p.dirname(path);
  try {
    return fs.lstatSync(dirname).isDirectory();
  } catch (error) {
    handleLstatError(error);
    return false;
  }
};

/**
 * Check if the path to the `package.json` file is valid
 *
 * @param path The path to the `package.json` file
 * @returns `true` if the path is valid, `false` otherwise
 */
const isValidPackageJsonPath = (path: string) => {
  // We need to check if the pointed file is `package.json`, and if it is, we
  // need to check if the file exist
  const basename = p.basename(path);
  if (basename !== 'package.json') return false;
  return fs.existsSync(path);
};

/**
 * Check if the path to the output and `package.json` files are valid. If one or
 * both of the path are invalid, an error is logged to stderr and the process
 * exits with code 1.
 *
 * @see {@link isValidOutputPath} & {@link isValidPackageJsonPath}
 *
 * @param outputPath The path to the output file
 * @param packageJsonPath The path to the `package.json` file
 */
const validatePath = (outputPath: string, packageJsonPath: string) => {
  let errorMessage: string | null = null;

  if (!isValidOutputPath(outputPath)) errorMessage = 'Output path is invalid';
  if (!isValidPackageJsonPath(packageJsonPath)) {
    errorMessage = errorMessage ? errorMessage + '\n' : '';
    errorMessage += '"package.json" path is invalid';
  }

  if (errorMessage) {
    logError(errorMessage);
    process.exit(1);
  }
};

export default validatePath;
