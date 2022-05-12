const express = require('express');

const createHandlers = () => {
    const handlePing = (req, res) => {
        res.send('OK');
    };

    return {
        handlePing,
    };
};

const createPingApp = () => {
    const handlers = createHandlers();
    const router = express.Router();

    router.get('/', handlers.handlePing);

    return router;
};

module.exports = createPingApp;
