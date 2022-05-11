const Bluebird = require('bluebird');
const createMessageStore = require('../');

const CATEGORY_NAME = 'test';

const TEST_EVENT_1 = {
    type: 'TestEvent1',
    streamName: 'test-stream1',
    data: {
        k1: 'v1',
    },
    metadata: {
        k2: 'v2',
    },
};

const TEST_EVENT_2 = {
    type: 'TestEvent2',
    streamName: 'test-stream2',
    data: {
        k3: 'v3',
    },
    metadata: {
        k4: 'v4',
    },
};

const TEST_EVENT_3 = {
    type: 'TestEvent1',
    streamName: 'test-stream1',
    data: {
        k5: 'v5',
    },
    metadata: {
        k6: 'v6',
    },
};

describe('message store', () => {
    let store;

    // Both drivers do not supoort returning ids!
    let generatedIds = [];

    beforeAll(async () => {
        store = createMessageStore({ db: null, driver: 'in-memory' });

        await store.write(TEST_EVENT_1.streamName, TEST_EVENT_1, null).then((id) => generatedIds.push(id));
        await store.write(TEST_EVENT_2.streamName, TEST_EVENT_2, null).then((id) => generatedIds.push(id));
        await store.write(TEST_EVENT_3.streamName, TEST_EVENT_3, null).then((id) => generatedIds.push(id));
    });

    it('writes message to store', () => {
        expect(generatedIds.length).toBe(3);
    });

    it('reads messages from store', async () => {
        await store.read(TEST_EVENT_1.streamName).then((res) => {
            expect(res.length).toBe(2);
            expect(res[0].id).toBe(generatedIds[0]);
            expect(res[1].id).toBe(generatedIds[2]);
        });
    });

    it('reads last message from store', async () => {
        await store.readLastMessage(TEST_EVENT_2.streamName).then((res) => {
            expect(res.id).toBe(generatedIds[1]);
        });
    });

    it('fetches messages and applies projection', async () => {
        const testProjection = {
            $init: () => {
                return {
                    count: 0,
                    lastIdx: -1,
                };
            },
            TestEvent1: (projection, event) => {
                if (projection.lastIdx >= event.globalPosition) return projection;

                return {
                    count: projection.count + 1,
                    lastIdx: event.globalPosition,
                };
            },
            TestEvent2: (projection, event) => {
                if (projection.lastIdx >= event.globalPosition) return projection;

                return {
                    count: projection.count + 1,
                    lastIdx: event.globalPosition,
                };
            },
        };

        await store.fetch(CATEGORY_NAME, testProjection).then((projection) => {
            expect(projection.count).toBe(3);
            expect(projection.lastIdx).toBe(3);
        });
    });

    it('manages subscriptions', async () => {
        let messagesProcessed = [];

        const testHandlers = {
            TestEvent1: (event) => {
                messagesProcessed.push(event);
                return Promise.resolve(true);
            },
            TestEvent2: (event) => {
                messagesProcessed.push(event);
                return Promise.resolve(true);
            },
        };

        const subscription = store.createSubscription({
            streamName: CATEGORY_NAME,
            subscriberId: 'test-subscriber',
            handlers: testHandlers,
        });

        subscription.start();
        await Bluebird.delay(100);
        expect(messagesProcessed.length).toBe(3);
        subscription.stop();
    });
});
