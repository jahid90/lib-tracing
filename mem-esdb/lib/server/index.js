const express = require('express');

const mountMiddlewares = require('./middlewares');
const mountRoutes = require('./routes');

const createServer = ({ store }) => {
    const app = express();

    mountMiddlewares({ app });
    mountRoutes({ app, store });

    return app;
};

module.exports = createServer;
