const createDb = require('./lib/store');
const createServer = require('./lib/server');

const createStore = ({ enableRestServer, port = 9999 }) => {
    const store = createDb();
    if (enableRestServer) {
        const server = createServer({ store });
        server.listen(port, () => console.log('store rest server is running on port: ' + port));
    }

    return store;
};

module.exports = createStore;
