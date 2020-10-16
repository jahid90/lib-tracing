const flags = [
    '--major', '--minor', '--patch'
];

const _showHelp = () => {
    console.log(`
update-version.js Updates the version in .app-metadata.json

Usage: node update-version.js [--major | --minor | --patch]

  Options:
    --major     Updates the major version
    --minor     Updates the minor version
    --patch     Updates the patch version; this is the default
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

const _update = (fn) => {
    const { create, read, write } = require('./lib/file');
    const { parse, stringify } = require('./lib/json');

    const filename = process.env.METADATA_FILE_NAME || '.app-metadata.json';

    // Read the file
    create(filename);
    const contents = read(filename);
    const parsed = parse(contents);

    // Update the version
    parsed.version = parsed.version || '0.1.2';
    parsed.version = fn(parsed.version);

    // Log the updated version
    console.log(`Info: version updated to ${parsed.version}`);

    // Write the updates to file
    const updatedContents = stringify(parsed);
    write(filename, updatedContents + '\n');
}

const main = () => {
    try {

        const version = require('./lib/version')

        const args = process.argv.slice(2);
        _validate(args);

        switch (args[0]) {
            case '--major':
                _update(version.nextMajor);
                break;

            case '--minor':
                _update(version.nextMinor);
                break;

            default:
                _update(version.nextPatch);
                break;
        }

    } catch (err) {
        console.error(`Error: ${err.message}`);
        _showHelp();
        process.exit(1);
    }
};

module.exports = main;
