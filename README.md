# proper-attribution

> Give a proper attribution to the authors of the packages you use.

It will create a `NOTICE.md` file at the root of your project directory. The file will contain the information necessary to give
attribution to the authors of the packages you use.

The information of the packages are:

- name
- version
- homepage url
- repository url
- author
- contributors
- license type
- copy of the license and copyright notice

See the [notice](./NOTICE.md) of this project for an exemple of what it looks like.

It works with `npm` and `pnpm`. I did not test it with yarn, and I won't,
because please, for the love of our disk drives, use
[pnpm](https://github.com/pnpm/pnpm).

## Installation

Add the package to your project as a dev dependency with

```text
(npm|pnpm) add -D proper-attribution
```

You can also install it globally, although I wouldn't recommend it for an
obvious reason: you won't give any attribution to `proper-attribution`...

```text
(npm|pnpm) add -g proper-attribution
```

## Usage

The recommended way is to add the file to the `files` field of your
`package.json`, and the command to your `prepack` life cycle script. It will be
then executed every time you run `(npm|pnpm) pack` and `(npm|pnpm) publish`, and
the file will be added to the package created. \
_(please refer to
[the npm
documentation](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)
for additional information)_

```JSON
{
  "files": {
    "NOTICE.md"
  },
  "scripts": {
    "prepack": "proper-attribution"
  }
}
```

If you've installed the package with `pnpm` as a (dev) dependency, you can execute it from
your cli with

```text
pnpm exec proper-attribution
```

### Important

Because it uses `node_modules` folders, you should be aware of three things:

- For this program to work, all the packages your program uses must be
  installed, so make sure the `node_modules` folder is present. If it is not,
  run `(npm|pnpm) install`.
- Dev dependencies of your dependencies are not installed (meaning not in your
  `node_modules` folder), therefore this program cannot give attribution to
  these packages.
- Packages that you have previously uninstalled/removed may still be present in
the `node_modules` folder. These packages will be then added to the notice file.
To avoid this, you must run `(npm|pnpm) prune` before running this program.

## Options

```text
Usage: proper-attribution [options]

  -V, --version          output the version number
  -o, --output <path>    change the output filename and directory (default: "NOTICE")
  --package-json <path>  specify a `package.json` path (default: "package.json")
  -D, --exclude-dev      exclude dev dependencies (default: false)
  -h, --help             display help for command
```
