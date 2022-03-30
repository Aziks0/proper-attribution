import fs from 'fs';
import * as p from 'path';
import walkdir, { WalkEventListener } from 'walkdir';
import { logError } from './utils/logging';

const scanNodeModules = (
  rootDirPath: string,
  onFileCallback: WalkEventListener,
  onEndCallback: () => void
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
  walker.on('file', onFileCallback);
  walker.on('end', onEndCallback);
};

export default scanNodeModules;
