import fs from 'fs';

type TPeople = string | { name: string; email?: string; url?: string };
type TAuthor = TPeople;
type TContributors = TPeople[];

type TDependencies = Object;
type TRepository = string | { url: string };

interface PackageJson {
  name: string;
  version: string;
  homepage?: string;
  license?: string;
  author?: TAuthor;
  contributors?: TContributors;
  repository?: TRepository;
  dependencies?: TDependencies;
  devDependencies?: TDependencies;
}

const getPackageJsonContent = (path: string): PackageJson => {
  const packageJsonBuffer = fs.readFileSync(path);
  return JSON.parse(packageJsonBuffer.toString());
};

const getDevDependencies = (path: string) => {
  const packageJson = getPackageJsonContent(path);

  const devDependencies = packageJson.devDependencies;
  if (devDependencies) return Array.from(Object.keys(devDependencies));

  return null;
};

export { getDevDependencies };
