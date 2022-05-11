const Bluebird = require('bluebird');

const deserializeMessage = require('./deserialize-message');

const project = (events, projection) => {
    return events.reduce((entity, event) => {
        if (!projection[event.type]) {
            return entity;
        }

        return projection[event.type](entity, event);
    }, projection.$init());
};

const createRead = ({ db }) => {
    const readLastMessage = (streamName) => {
        return db
            .getLastEventFromStream({ streamName })
            .then((id) => db.getEventDetail({ id }))
            .then((res) => deserializeMessage(res));
    };

    const read = (streamName, fromPosition = 1, maxMessages = 1000) => {
        --fromPosition; // adjust for +1 from subscription
        if (Array.isArray(streamName)) {
            return Bluebird.all(
                streamName.map((category) => db.getAllEventsFromCategory({ category, fromPosition }))
            ).then((ids) => Bluebird.all(ids.map((id) => db.getEventDetail({ id }))));
        } else if (streamName === '$all') {
            return db
                .getAllEvents(fromPosition)
                .then((ids) => Bluebird.all(ids.map((id) => db.getEventDetail({ id }))));
        } else if (streamName.includes('-')) {
            return db
                .getAllEventsFromStream({ streamName, fromPosition })
                .then((ids) => Bluebird.all(ids.map((id) => db.getEventDetail({ id }))));
        } else {
            return db
                .getAllEventsFromCategory({ category: streamName, fromPosition })
                .then((ids) => Bluebird.all(ids.map((id) => db.getEventDetail({ id }))));
        }
    };

    const fetch = (streamName, projection) => {
        return read(streamName).then((messages) => project(messages, projection));
    };

    return {
        read,
        readLastMessage,
        fetch,
    };
};

module.exports = createRead;
