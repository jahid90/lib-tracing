# Repository of libraries

## @jahid90/package

Utility functions for package management

### Usage

#### Install as dependency

```shell
npm install -g @jahid90/package
```
### Updating package version

#### get-version script

The `get-version` script retrieves the current package version. It uses the `package.json` file by default to retrieve the version information from. This can be changed by supplying a custom file with the `METADATA_FILE_NAME` env variable.

```shell
get-version
```

```shell
METADATA_FILE_NAME=custom.json get-version
```

#### update-version script

The `update-version` script handles managing package versions. It uses `package.json` by default. It takes any one of three flags `[--major, --minor, --patch]`. If no arguments are passed, `--patch` is implied. The default file to store/retrieve version to/from can be changed with the `METADATA_FILE_NAME` env variable.

```shell
update-version
```

```shell
METADATA_FILE_NAME=custom.json update-version --major
```

#### Alternative usage

##### Add package.json scripts

```shell
cat package.json

{
  ...
  scripts: {
    ...
    "version:get": "get-version"
    "version:update": "update-version"
    "version:update:major": "update-version --major",
    "version:update:minor": "update-version --minor",
    "version:update:patch": "update-version --patch",
    ...
  },
  ...
}
```

##### Run the scripts

```shell
npm run version:update:minor
```


### Development

#### Checkout the source

```shell
git clone https://github.com/jahid90/package.git
```

#### Publishing

```shell
npm login
npm publish --scope public
```
