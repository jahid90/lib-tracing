const createStore = require('../lib/store');

const TEST_EVENT_1 = {
    id: 'test-id-1',
    type: 'TestEvent1',
    streamName: 'test-stream-1',
    data: {
        k1: 'v1',
    },
    metadata: {
        k2: 'v2',
    },
};

const TEST_EVENT_2 = {
    id: 'test-id-2',
    type: 'TestEvent2',
    streamName: 'test-stream-2',
    data: {
        k3: 'v3',
    },
    metadata: {
        k4: 'v4',
    },
};

const TEST_EVENT_3 = {
    id: 'test-id-3',
    type: 'TestEvent1',
    streamName: 'test-stream-1',
    data: {
        k5: 'v5',
    },
    metadata: {
        k6: 'v6',
    },
};

describe('in-memory event store', () => {
    let store;

    let generatedIds = [];

    beforeAll((done) => {
        store = createStore();

        store.addEvent(TEST_EVENT_1).then((id) => generatedIds.push(id));
        store.addEvent(TEST_EVENT_2).then((id) => generatedIds.push(id));
        store.addEvent(TEST_EVENT_3).then((id) => generatedIds.push(id));

        done();
    });

    it('stores events', () => {
        expect(generatedIds.length).toBe(3);
    });

    it('retrieves all events', async () => {
        await store.getAllEvents().then((eventIds) => {
            expect(eventIds.length).toBe(3);
            expect(eventIds[0]).toBe(generatedIds[0]);
            expect(eventIds[1]).toBe(generatedIds[1]);
            expect(eventIds[2]).toBe(generatedIds[2]);
        });
    });

    it('retrieves events from stream', async () => {
        await store.getAllEventsFromStream({ streamName: TEST_EVENT_1.streamName }).then((eventIds) => {
            expect(eventIds.length).toBe(2);
            expect(eventIds[0]).toBe(generatedIds[0]);
            expect(eventIds[1]).toBe(generatedIds[2]);
        });
    });

    it('retrieves last event from stream', async () => {
        await store.getLastEventFromStream({ streamName: TEST_EVENT_1.streamName }).then((eventId) => {
            expect(eventId).toBe(generatedIds[2]);
        });
    });

    it('retrieves event by type', async () => {
        await store.getAllEventsOfType({ type: TEST_EVENT_2.type }).then((eventIds) => {
            expect(eventIds.length).toBe(1);
            expect(eventIds[0]).toBe(generatedIds[1]);
        });
    });

    it('retrieves event detail', async () => {
        await store.getEventDetail({ id: generatedIds[1] }).then((event) => {
            expect(event.type).toBe(TEST_EVENT_2.type);
            expect(event.streamName).toBe(TEST_EVENT_2.streamName);
            expect(event.data).toEqual(TEST_EVENT_2.data);
            expect(event.metadata).toEqual(TEST_EVENT_2.metadata);
        });
    });
});
