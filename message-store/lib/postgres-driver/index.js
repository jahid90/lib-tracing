const createRead = require('./read');
const createWrite = require('./write');

const createPostgresClient = require('./clients/postgres-client');

const createApi = ({ connectionString, debug }) => {
    console.debug('connection string is: ' + connectionString);
    const db = createPostgresClient({ connectionString });

    read = createRead({ db });
    write = createWrite({ db });

    return {
        write: write.writeMessage,
        delete: write.deleteMessageById,
        read: read.read,
        readLast: read.readLastMessage,
        readById: read.readById,
        readByType: read.readByType,
        readByEntityId: read.readByEntityId,
        readByMetadataAttribute: read.readByMetadataAttribute,
        project: read.project,
    };
};

module.exports = createApi;
