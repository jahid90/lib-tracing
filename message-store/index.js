const createStore = require('@jahiduls/mem-esdb');

const createRead = require('./lib/postgres-driver/read');
const createWrite = require('./lib/postgres-driver/write');

const createMemRead = require('./lib/in-memory-driver/read');
const createMemWrite = require('./lib/in-memory-driver/write');

const configureCreateSubscription = require('./lib/subscribe');

const createMessageStore = ({ driver, db }) => {
    let read;
    let write;

    if (driver === 'postgres') {
        read = createRead({ db });
        write = createWrite({ db });
    } else if (driver == 'in-memory') {
        db = createStore();
        read = createMemRead({ db });
        write = createMemWrite({ db });
    } else {
        throw new Error(`Unsupported driver type: ${driver}. Use one of ['postgres', 'in-memory'].`);
    }

    const createSubscription = configureCreateSubscription({
        read: read.read,
        readLastMessage: read.readLastMessage,
        write,
    });

    return {
        createSubscription,
        write,
        read: read.read,
        readLastMessage: read.readLastMessage,
        fetch: read.fetch,
    };
};

module.exports = createMessageStore;
