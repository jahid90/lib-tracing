const flags = [
    '--major', '--minor', '--patch'
];

const _showHelp = () => {
    console.log(`
get-version.js Fetches the version from config file. Config file is package.json by default.
                  Can be overridden by an env variable - METADATA_FILE_NAME

Usage: node get-version.js [--major | --minor | --patch]

  Options:
    --major     Fetches the major version
    --minor     Fetches the minor version
    --patch     Fetches the patch version;

  If no flag is passed, the complete version is returned.
    `);
};

const _validate = (args) => {
    if (args.length > 1) {
        throw new Error('expected a single flag');
    }

    if (args.length > 0 && flags.filter(f => f === args[0]).length == 0) {
        throw new Error(`expected one of [--major]|[--minor]|[--patch]; got ${args[0]}`);
    }
};

const _fetch = (fn) => {
    const { create, read, write } = require('./lib/file');
    const { parse, stringify } = require('./lib/json');

    const filename = process.env.METADATA_FILE_NAME || 'package.json';

    // Read the file
    create(filename);
    const contents = read(filename);
    const parsed = parse(contents);

    // Update the version
    version = parsed.version || '0.0.0';
    version = fn(version);

    // Log the updated version
    console.debug(`Info: version in ${filename} is ${version}`);

    return version;
}

const main = () => {
    try {

        const version = require('./lib/version');

        const args = process.argv.slice(2);
        _validate(args);

        switch (args[0]) {
            case '--major':
                return _fetch(version.major);

            case '--minor':
                return _fetch(version.minor);

            case '--patch':
                return _fetch(version.patch);

            default:
                return _fetch((version) => version);
        }

    } catch (err) {
        console.error(`Error: ${err.message}`);
        _showHelp();
        process.exit(1);
    }
};

module.exports = main;
