const supertest = require('supertest');

const createStore = require('../lib/store');
const createServer = require('../lib/server');

describe('store rest server', () => {
    let store;
    let server;

    let eventId;

    beforeAll(() => {});

    beforeEach(async () => {
        store = createStore();
        server = createServer({ store });

        await supertest(server)
            .get('/db/events')
            .then((res) => (eventId = res.body[0]));
    });

    it('responds to ping requests', async () => {
        await supertest(server)
            .get('/ping')
            .expect(200)
            .then((res) => {
                expect(res.text).toBe('OK');
                return store.getAllEvents();
            })
            .then((ids) => {
                expect(ids.length).toBe(2); // ping creates a ping event
                return ids;
            })
            .then((ids) => store.getEventDetail({ id: ids[1] })) // 0th is the view all events request from beforeEach
            .then((event) => {
                expect(event.type).toBe('PingRequest');
                expect(event.streamName).toBe('esdb-requests');
                expect(event.data.requestAt).not.toBeNull();
                expect(event.metadata.traceId).not.toBeNull();
            });
    });

    it('fetches all events', async () => {
        await supertest(server)
            .get('/db/events')
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(2);
                return res.body;
            })
            .then((ids) => Promise.all(ids.map((id) => store.getEventDetail({ id }))))
            .then((events) => {
                expect(events.length).toBe(2);
                expect(events[0].type).toBe('ViewAllEventsRequest');
                expect(events[1].type).toBe('ViewAllEventsRequest');
            });
    });

    it('fetches all events with details', async () => {
        await supertest(server)
            .get('/db/events?full')
            .expect(200)
            .then((res) => res.body)
            .then((events) => {
                expect(events.length).toBe(2);
                expect(events[0].type).toBe('ViewAllEventsRequest');
                expect(events[1].streamName).toBe('esdb-requests');
            });
    });

    it('fetches event details', async () => {
        await supertest(server)
            .get(`/db/events/${eventId}`)
            .expect(200)
            .then((res) => res.body)
            .then((event) => {
                expect(event.type).toBe('ViewAllEventsRequest');
                expect(event.streamName).toBe('esdb-requests');
                expect(event.data.requestAt).not.toBeNull();
                expect(event.metadata.traceId).not.toBeNull();
                expect(event.streamPosition).toBe(1);
                expect(event.globalPosition).toBe(1);
                expect(event.time).not.toBeNull();
            });
    });
});
