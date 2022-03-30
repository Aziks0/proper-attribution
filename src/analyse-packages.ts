import scanNodeModules from './scan-node-modules';
import { getPackageJsonContent, getPackageInfos } from './analyse-package';
import * as md from './utils/markdown';
import * as p from 'path';
import fs from 'fs';

const startAnalyse = (
  rootDirPath: string,
  outputFile: string,
  excludedDependencies: string[] | null
) => {
  const writeNotice = (path: string) => {
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
    writer.write(infos);
  };

  const title = md.toHeader(
    'Third Party Copyright Notices',
    md.MarkdownHeaders.H1
  );
  const writer = fs.createWriteStream(outputFile);
  writer.write(title);

  scanNodeModules(rootDirPath, writeNotice, () => writer.end());
};

export default startAnalyse;
