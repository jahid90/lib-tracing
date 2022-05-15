const axios = require('axios');
const { v4: uuid } = require('uuid');

const createInterceptors = require('./interceptors');

const createClient = ({ url, debug }) => {
    const client = axios.create({
        baseURL: url,
        timeout: 100,
        headers: {
            'x-request-id': uuid(),
        },
    });

    const interceptors = createInterceptors({ debug });
    client.interceptors.request.use(interceptors.requestInterceptor, interceptors.requestErrorInterceptor);
    client.interceptors.response.use(interceptors.responseInterceptor, interceptors.responseErrorInterceptor);

    const ping = async () => {
        return client.get('/ping');
    };

    const addEvent = async ({ type, streamName, data, metadata }) => {
        return client.post('/events/', {
            type,
            streamName,
            data,
            metadata,
        });
    };

    const deleteEvent = async ({ id }) => {
        return client.delete(`/events/${id}`);
    };

    const getAllEvents = (fromPosition) => {
        return client.get(`/events/?fromPosition=${fromPosition}`);
    };

    const getAllEventsFromStream = async (streamName, fromPosition) => {
        return client.get(`/events/stream/${streamName}?fromPosition=${fromPosition}`);
    };

    const getLastEventFromStream = async ({ streamName }) => {
        return client.get(`/events/stream/${streamName}/last`);
    };

    const getAllEventsFromCategory = async ({ category, fromPosition }) => {
        return client.get(`/events/category/${category}?fromPosition=${fromPosition}`);
    };

    const getAllEventsOfType = async ({ type }) => {
        return client.get(`/events/type/${type}`);
    };

    const getAllEventsMatchingMetadataAttr = async ({ attrName, attrValue }) => {
        return client.get(`/events/metadata/${attrName}/${attrValue}`);
    };

    const getEventDetail = async ({ id }) => {
        return client.get(`/events/${id}`);
    };

    return {
        ping,
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

module.exports = createClient;
