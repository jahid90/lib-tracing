const createPingApp = require('./ping');

const mountRoutes = ({ app }) => {
    const pingApp = createPingApp();

    app.use('/ping', pingApp);
};

module.exports = mountRoutes;
