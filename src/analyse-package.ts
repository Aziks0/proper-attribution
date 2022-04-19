import fs from 'fs';
import * as p from 'path';
import * as md from './utils/markdown';

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

/**
 * Get the content of a `package.json` file
 *
 * @param path The path to the `package.json` file
 * @returns A `package.json` as an object
 */
const getPackageJsonContent = (path: string): PackageJson => {
  const packageJsonBuffer = fs.readFileSync(path);
  return JSON.parse(packageJsonBuffer.toString());
};

/**
 * Get the dev dependencies names of a `package.json` file
 *
 * @param path The path to the `package.json` file
 * @returns An array containing the dev dependencies names from the
 * `package.json` file, or `null` if there are none
 */
const getDevDependencies = (path: string) => {
  const packageJson = getPackageJsonContent(path);

  const devDependencies = packageJson.devDependencies;
  if (devDependencies) return Array.from(Object.keys(devDependencies));

  return null;
};

/**
 * Format a person's information from a `package.json` file to
 * `{NAME} <{EMAIL}> ({URL})`
 *
 * @param people A person's information from a `package.json` file
 * @returns The formatted information of the person
 */
const formatPeople = (people: TPeople) => {
  // `<` needs to be escaped to avoid GitHub removing it
  if (typeof people === 'string') return people.replace('<', '\\<');

  let people_ = people.name;
  // `<` needs to be escaped to avoid GitHub removing it
  if (people.email) people_ += ` \\<${people.email}>`;
  if (people.url) people_ += ` (${people.url})`;
  return people_;
};

/**
 * Format a list of persons from a `package.json` file
 *
 * @param contributors An array of persons information from a `package.json`
 * file
 * @returns An array of the formatted information of the persons
 * @see {@link formatPeople}
 */
const formatContributors = (contributors: TContributors) => {
  return contributors.map((contributor) => formatPeople(contributor));
};

/**
 * Get a repository url from a `package.json` file
 *
 * @param repository
 * @returns The repository url
 */
const getRepository = (repository: TRepository) => {
  return typeof repository === 'string' ? repository : repository.url;
};

/**
 * Format a pair of key/value to the markdown string
 * `**key:** value \\n`
 *
 * @param key The text key
 * @param value The text value
 * @returns The string `**key:** value \\n`
 */
const formatLine = (key: string, value: string) => {
  return (
    md.toEmphasis(key + ':', md.MarkdownEmphasis.BOLD) + ' ' + value + ' \\\n'
  );
};

/**
 * Get the filename of a license file (`license`|`licence`)
 *
 * @param path The path to the directory containing the license file
 * @returns The filename of the license file, or undefined if none are found
 */
const getLicenseFilename = (path: string) => {
  const files = fs.readdirSync(path);
  return files.find((file) => {
    file = file.toLowerCase();
    if (file.startsWith('license') || file.startsWith('licence')) return true;
    return false;
  });
};

/**
 * Get the information from a `package.json` file, and format it as a markdown
 * text.
 *
 * The information taken are:
 * - name
 * - version
 * - homepage url
 * - repository url
 * - author
 * - contributors
 * - license type
 * - copy of the license and copyright notice
 *
 * Check the code for more details on the formatting.
 *
 * @param path The path to the `package.json` file
 * @returns The information formatted as a markdown text
 */
const getPackageInfos = (path: string) => {
  const packageJsonBuffer = fs.readFileSync(path);
  const packageJson: PackageJson = JSON.parse(packageJsonBuffer.toString());

  // `name` is required in npm package.json, so if `name` is undefined, the
  // current file is then not in a npm package, and we can skip it
  if (!packageJson.name) return;

  // Title
  let markdownText = md.toHeader(
    packageJson.name + '@' + packageJson.version,
    md.MarkdownHeaders.H2
  );

  // Homepage
  if (packageJson.homepage)
    markdownText += formatLine('Homepage', packageJson.homepage);

  // Repo
  if (packageJson.repository) {
    const repository = getRepository(packageJson.repository);
    markdownText += formatLine('Repository', repository);
  }

  // Author
  if (packageJson.author) {
    const author = formatPeople(packageJson.author);
    markdownText += formatLine('Author', author);
  }

  // Contributors
  if (packageJson.contributors) {
    const contributors = formatContributors(packageJson.contributors);
    markdownText += md.toList(
      contributors,
      md.MarkdownLists.INDENTED,
      'Contributors:',
      true
    );
  }

  // License type
  if (packageJson.license)
    markdownText += formatLine('License', packageJson.license);

  // Remove last `\`
  const lastBackslashIndex = markdownText.lastIndexOf('\\');
  markdownText = markdownText.slice(0, lastBackslashIndex);
  markdownText += '\n';

  // License text
  const dirname = p.dirname(path);
  const licenseFileName = getLicenseFilename(dirname);
  if (!licenseFileName) return markdownText;

  path = p.join(dirname, licenseFileName);
  const buffer = fs.readFileSync(path);
  const text = buffer.toString();
  markdownText += md.toCode(text);

  return markdownText;
};

export { getPackageJsonContent, getDevDependencies, getPackageInfos };
