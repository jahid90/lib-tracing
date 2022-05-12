const createDb = require('./lib/store');
const createServer = require('./lib/server');

const createStore = ({ enableRestServer, port = 9999 }) => {
    if (enableRestServer) {
        const server = createServer();
        server.listen(port, () => console.log('REST server is running on port: ' + port));
    }
    const store = createDb();

    return store;
};

module.exports = createStore;
