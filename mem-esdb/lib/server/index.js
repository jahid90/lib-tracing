const express = require('express');

const mountMiddlewares = require('./middlewares');
const mountRoutes = require('./routes');

const createServer = () => {
    const app = express();

    mountMiddlewares({ app });
    mountRoutes({ app });

    return app;
};

module.exports = createServer;
