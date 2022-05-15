const createClient = require('./clients/meeves-client');
const createRead = require('./read');
const createWrite = require('./write');

const createApi = ({ connectionString, logLevel, clientId }) => {
    console.debug('connection string is: ' + connectionString);
    const db = createClient({ url: connectionString, logLevel, clientId });
    read = createRead({ db });
    write = createWrite({ db });

    return {
        write: write.writeMessage,
        delete: write.deleteMessageById,
        read: read.read,
        readLast: read.readLastMessage,
        readById: read.readById,
        readByType: read.readByType,
        readByEntity: read.readByEntity,
        readByMetadataAttribute: read.readByMetadataAttribute,
        project: read.project,
    };
};

module.exports = createApi;
