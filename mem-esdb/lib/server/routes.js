const createPingApp = require('./ping');
const createDbApp = require('./db');

const mountRoutes = ({ app, store }) => {
    const pingApp = createPingApp({ store });
    const dbApp = createDbApp({ store });

    app.use('/ping', pingApp);
    app.use('/db', dbApp);
};

module.exports = mountRoutes;
