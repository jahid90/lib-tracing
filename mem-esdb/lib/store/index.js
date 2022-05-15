const { v4: uuid } = require('uuid');

const createStore = () => {
    const db = {};
    db.events = [];
    db.eventsByStream = {};
    db.eventsByType = {};
    db.eventsById = {};

    const addEvent = ({ type, streamName, data, metadata }) => {
        if (!streamName.includes('-')) {
            throw new Error('streamName must be of the form <category-entityId>');
        }

        db.eventsByStream[streamName] = db.eventsByStream[streamName] || [];
        db.eventsByType[type] = db.eventsByType[type] || [];

        const id = uuid();
        const globalPosition = db.events.length + 1;
        const streamPosition = db.eventsByStream[streamName].length + 1;
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
        // We can store just the ids in the below lists
        db.events = [...db.events, id];
        db.eventsByStream[streamName] = [...db.eventsByStream[streamName], id];
        db.eventsByType[type] = [...db.eventsByType[type], id];

        return Promise.resolve(id);
    };

    const deleteEvent = ({ id }) => {
        const eventToDelete = db.eventsById[id];
        if (!eventToDelete) {
            console.warn('deleting event failed. no such event: ' + id);
            return Promise.resolve(false);
        }

        delete db.eventsById[id];
        db.events = db.events.filter((e) => e !== id);
        db.eventsByStream[eventToDelete.streamName] = db.eventsByStream[eventToDelete.streamName].filter(
            (e) => e !== id
        );
        db.eventsByType[eventToDelete.type] = db.eventsByType[eventToDelete.type].filter((e) => e !== id);

        return Promise.resolve(true);
    };

    const getAllEvents = (fromPosition = 0) => {
        return Promise.resolve(db.events.slice(fromPosition));
    };

    const getAllEventsFromStream = ({ streamName, fromPosition = 0 }) => {
        return Promise.resolve((db.eventsByStream[streamName] || []).slice(fromPosition));
    };

    const getLastEventFromStream = ({ streamName }) => {
        const matched = db.eventsByStream[streamName];

        if (!matched) {
            return Promise.resolve(false);
        }

        const lastIdx = matched.length - 1;
        return Promise.resolve(matched[lastIdx]);
    };

    const getAllEventsFromCategory = ({ category, fromPosition = 0 }) => {
        const matched =
            db.events
                .map((id) => db.eventsById[id])
                .filter((e) => e.streamName.startsWith(category + '-'))
                .map((e) => e.id) || [];
        return Promise.resolve(matched.slice(fromPosition));
    };

    const getAllEventsOfType = ({ type, fromPosition = 0 }) => {
        return Promise.resolve((db.eventsByType[type] || []).slice(fromPosition));
    };

    const getAllEventsMatchingMetadataAttr = ({ attrName, attrValue }) => {
        return (
            db.events
                .map((id) => db.eventsById[id])
                .filter((e) => e.metadata[attrName] === attrValue)
                .map((e) => e.id) || []
        );
    };

    const getEventDetail = ({ id }) => {
        if (!db.eventsById[id]) {
            return Promise.resolve(false);
        }

        return Promise.resolve(db.eventsById[id]);
    };

    return {
        addEvent,
        deleteEvent,
        getAllEvents,
        getAllEventsFromStream,
        getLastEventFromStream,
        getAllEventsFromCategory,
        getAllEventsOfType,
        getAllEventsMatchingMetadataAttr,
        getEventDetail,
    };
};

module.exports = createStore;
