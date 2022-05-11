const createWrite = ({ db }) => {
    return (streamName, message, expectedVersion) => {
        if (!message.type) {
            throw new Error('Messages must have a type');
        }

        if (expectedVersion) {
            console.warn('expected-version check for optimistic locking is not currently supported');
        }

        return db.addEvent({
            type: message.type,
            streamName,
            data: message.data,
            metadata: message.metadata,
        });
    };
};

module.exports = createWrite;
