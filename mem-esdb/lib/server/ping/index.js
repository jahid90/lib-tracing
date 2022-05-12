const express = require('express');

const createHandlers = ({ store }) => {
    const handlePing = (req, res) => {
        const event = {
            type: 'PingRequest',
            streamName: 'esdb-requests',
            data: {
                requestAt: Date.now(),
            },
            metadata: {
                traceId: req.context.requestId,
            },
        };

        return store
            .addEvent(event)
            .then((_) => res.send('OK'))
            .catch((err) => {
                console.error(err.message);
                return res.send('OK');
            });
    };

    return {
        handlePing,
    };
};

const createPingApp = ({ store }) => {
    const handlers = createHandlers({ store });
    const router = express.Router();

    router.get('/', handlers.handlePing);

    return router;
};

module.exports = createPingApp;
