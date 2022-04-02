import scanNodeModules from './scan-node-modules';
import { getPackageJsonContent, getPackageInfos } from './analyse-package';
import * as md from './utils/markdown';
import * as p from 'path';
import fs from 'fs';
import { WalkEventListener } from 'walkdir';

/**
 * Analyse recursively a `node_modules` folder, looking for `package.json`
 * files. For every valid `package.json` file, some information will be taken
 * and written into the `outputFile`. This information will be formatted as a
 * markdown text.
 *
 * @param rootDirPath The directory root path. Should be the one that contains
 * the `node_modules` folder.
 * @param outputFile The path to the file containing the information
 * @param excludedDependencies An array of the excluded dependencies names
 * @see {@link getPackageInfos}
 */
const startAnalyse = (
  rootDirPath: string,
  outputFile: string,
  excludedDependencies: string[] | null
) => {
  /** Ignore `test` folder */
  const ignorePath: WalkEventListener = function (path: string) {
    const basename = p.basename(path);
    if (basename !== 'test' && basename !== 'tests') return;
    this.ignore(path);
  };

  /** Write the packages information to the output file */
  const writeNotice: WalkEventListener = (path: string) => {
    const filename = p.basename(path);
    if (filename !== 'package.json') return;

    const packageJson = getPackageJsonContent(path);

    // Don't write notice for excluded dependencies
    if (excludedDependencies?.includes(packageJson.name)) {
      const i = excludedDependencies.indexOf(packageJson.name);
      excludedDependencies.splice(i, 1);
      return;
    }

    const infos = getPackageInfos(path);
    if (!infos) return;

    writer.write(infos);
  };

  const title = md.toHeader(
    'Third Party Copyright Notices',
    md.MarkdownHeaders.H1
  );
  const writer = fs.createWriteStream(outputFile);
  writer.write(title);

  scanNodeModules(rootDirPath, ignorePath, writeNotice, () => writer.end());
};

export default startAnalyse;
