const VersionConflictError = require('../version-conflict-error');

const writeMessageSql = 'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)';
const versionConflictErrorRegex = /^Wrong.*Stream Version: ​​(\d​​+​​)\)/;

const deleteMessageSql = `DELETE FROM messages WHERE id = $1`;

const createWrite = ({ db }) => {
    const writeMessage = (streamName, message, expectedVersion) => {
        if (!message.type) {
            throw new Error('Messages must have a type');
        }

        const values = [message.id, streamName, message.type, message.data, message.metadata, expectedVersion];

        return db.query(writeMessageSql, values).catch((err) => {
            const errorMatch = err.message.match(versionConflictErrorRegex);
            const notVersionConflict = errorMatch === null;

            if (notVersionConflict) {
                throw err;
            }

            const actualVersion = parseInt(errorMatch[1], 10);
            const versionConflictError = new VersionConflictError(streamName, actualVersion, expectedVersion);
            versionConflictError.stack = err.stack;

            throw versionConflictError;
        });
    };

    const deleteMessageById = ({ id }) => {
        return db.query(deleteMessageSql, [id]);
    };

    return {
        writeMessage,
        deleteMessageById,
    };
};

module.exports = createWrite;
