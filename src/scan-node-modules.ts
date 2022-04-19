import fs from 'fs';
import * as p from 'path';
import walkdir, { WalkEventListener } from 'walkdir';
import { logError } from './utils/logging';

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
