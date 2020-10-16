const create = (filename) => {

    const fs = require('fs');

    if (!fs.existsSync(filename)) {
        console.info(`Info: file ${filename} does not exist in the current directory`);
        fs.writeFileSync(filename, '{}\n');
        console.info(`Info: created ${filename}`);
    } else {
        console.debug(`Debug: ${filename} already exists in the current directory`)
    }

};

const read = (filename) => {

    const fs = require('fs');

    // Check that file exists
    if (!fs.existsSync(filename)) {
        console.error(`Error: could not find '${filename}' in the current directory`);
        process.exit(1);
    }

    try {
        // Read the file contents and return it as a string/Buffer
        const contents = fs.readFileSync(filename);
        return contents;
    } catch (err) {
        // If input is a directory, catch the error and display an error
        console.error(`Error: '${filename}' is a directory`);
        console.debug(err);
        process.exit(1);
    }

};

const write = (filename, contents) => {
    try {

        const fs = require('fs');
        fs.writeFileSync(filename, contents);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }

}

module.exports = {
    create,
    read,
    write
};
