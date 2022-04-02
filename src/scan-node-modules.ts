import fs from 'fs';
import * as p from 'path';
import walkdir, { WalkEventListener } from 'walkdir';
import { logError } from './utils/logging';

/**
 * Walk recursively a `node_module` folder.
 *
 * If the `node_module` folder is not found, an error will be logged to stderr
 * and the program will exit with code 1.
 *
 * @param rootDirPath The directory root path. Should be the one that contains
 * the `node_modules` folder.
 * @param onPathCallback The callback called before a path is walked
 * @param onFileCallback The callback called when a file has been found
 * @param onEndCallback The callback called when every paths have been walked
 */
const scanNodeModules = (
  rootDirPath: string,
  onPathCallback?: WalkEventListener,
  onFileCallback?: WalkEventListener,
  onEndCallback?: () => void
) => {
  const nodeModulesPath = p.join(rootDirPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    logError(
      'Node modules folder not found' +
        '\nPlease make sure you ran "(npm|pnpm) install" in the project folder'
    );
    process.exit(1);
  }

  const walker = walkdir(nodeModulesPath);
  if (onPathCallback) walker.on('path', onPathCallback);
  if (onFileCallback) walker.on('file', onFileCallback);
  if (onEndCallback) walker.on('end', onEndCallback);
};

export default scanNodeModules;
