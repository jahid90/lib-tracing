# Repository of libraries

## @jahid90/package

Utility functions for package management

### Usage

#### Install as dependency

```shell
$ npm install @jahid90/package
```
#### Updating package versions

The `update-version` script handles managing package versions. It tracks the package version in a config file called `.app-metadata.json` by default. It takes any one of three flags `[--major, --minor, --patch]`. If no arguments are passed, `--patch` is implied.

##### Add package.json scripts

```shell
$ cat package.json

{
  ...
  scripts: {
    ...
    "update:version": "update-version"
    "update:version:major": "update-version --major",
    "update:version:minor": "update-version --minor",
    "update:version:patch": "update-version --patch",
    ...
  },
  ...
}
```

##### Run the scripts

```shell
$ npm run update:version
```


### Development

#### Checkout the source

```shell
$ git clone https://github.com/jahid90/package.git
```

#### Publishing

```shell
$ npm login
$ npm publish --scope public
```
