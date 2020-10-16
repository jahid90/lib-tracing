const parse = (jsonString) => {
    try {

        return JSON.parse(jsonString);

    } catch (err) {
        console.error(`Error: invalid json file`);
        console.debug(err);
        process.exit(1);
    }
};

const stringify = (json) => {
    try {

        return JSON.stringify(json, null, 2);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = {
    parse,
    stringify
};
