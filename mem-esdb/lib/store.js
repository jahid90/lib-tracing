const { v4: uuid } = require('uuid');

const createStore = () => {
    const db = {};
    db.events = [];
    db.eventsByStream = {};
    db.eventsByType = {};
    db.eventsById = {};

    const addEvent = ({ type, streamName, data, metadata }) => {
        db.eventsByStream[streamName] = db.eventsByStream[streamName] || [];
        db.eventsByType[type] = db.eventsByType[type] || [];

        const id = uuid();
        const globalPosition = db.events.length;
        const streamPosition = db.eventsByStream[streamName].length;
        const time = Date.now();

        const event = {
            id,
            type,
            streamName,
            data,
            metadata,
            streamPosition,
            globalPosition,
            time,
        };

        db.eventsById[id] = event;
        // We can just store the ids in the below lists
        db.events = [...db.events, event];
        db.eventsByStream[streamName] = [...db.eventsByStream[streamName], event];
        db.eventsByType[type] = [...db.eventsByType[type], event];

        return Promise.resolve(id);
    };

    const getAllEvents = () => {
        return Promise.resolve(db.events.map((e) => e.id));
    };

    const getAllEventsFromStream = ({ streamName }) => {
        return Promise.resolve((db.eventsByStream[streamName] || []).map((e) => e.id));
    };

    const getLastEventFromStream = ({ streamName }) => {
        const matched = db.eventsByStream[streamName];

        if (!matched) {
            return Promise.resolve(false);
        }

        const lastIdx = matched.length - 1;
        return Promise.resolve(matched[lastIdx].id);
    };

    const getAllEventsFromCategory = ({ category }) => {
        const matched = db.events.filter((e) => e.streamName.startsWith(category + '-')) || [];
        return Promise.resolve(matched.map((e) => e.id));
    };

    const getAllEventsOfType = ({ type }) => {
        return Promise.resolve((db.eventsByType[type] || []).map((e) => e.id));
    };

    const getEventDetail = ({ id }) => {
        if (!db.eventsById[id]) {
            return Promise.resolve(false);
        }

        return Promise.resolve(db.eventsById[id]);
    };

    return {
        addEvent,
        getAllEvents,
        getAllEventsFromStream,
        getLastEventFromStream,
        getAllEventsFromCategory,
        getAllEventsOfType,
        getEventDetail,
    };
};

module.exports = createStore;
