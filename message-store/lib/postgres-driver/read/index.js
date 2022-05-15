const Bluebird = require('bluebird');

const deserializeMessage = require('../deserialize-message');
const deserializeFromStringifiedJson = require('../deserialize-message-from-stringified-json');

const getLastMessageSql = `
    SELECT
        *
    FROM
        get_last_stream_message($1)
`;
const getCategoryMessagesSql = `
    SELECT
        *
    FROM
        get_category_messages($1, $2, $3)
`;
const getStreamMessagesSql = `
    SELECT
        *
    FROM
        get_stream_messages($1, $2, $3)
`;
const getMultipleCategoryMessagesSql = `
    SELECT
        id::varchar,
        stream_name::varchar,
        type::varchar,
        position::bigint,
        global_position::bigint,
        data::varchar,
        metadata::varchar,
        time::timestamp
    FROM
        messages
    WHERE
        category(stream_name) = ANY($1::varchar[])
    AND
        global_position >= $2
    ORDER BY
        global_position
    LIMIT $3
`;
const getAllMessagesSql = `
    SELECT
        id::varchar,
        stream_name::varchar,
        type::varchar,
        position::bigint,
        global_position::bigint,
        data::varchar,
        metadata::varchar,
        time::timestamp
    FROM
        messages
    WHERE
        global_position >= $1
    ORDER BY
        global_position
    LIMIT $2
`;

const getOneMessageByIdSql = `
    SELECT * FROM messages WHERE id = $1 LIMIT 1
`;

const getAllMessagesByMetadataAttributeSql = (attrName) => `
    SELECT
        *
    FROM
        messages
    WHERE
        metadata->>'${attrName}' = $1
    ORDER BY
        global_position ASC
`;

const getAllStreamMessagesByMetadataAttributeSql = (attrName) => `
    SELECT
        *
    FROM
        messages
    WHERE
        stream_name = $1
    AND
        metadata->>'${attrName}' = $2
    ORDER BY
        global_position ASC
`;

const getAllCategoryMessagesByMetadataAttributeSql = (attrName) => `
    SELECT
        *
    FROM
        messages
    WHERE
        category(stream_name) = $1
    AND
        metadata->>'${attrName}' = $2
    ORDER BY
        global_position ASC
`;

const getAllMessagesByType = `
    SELECT
        *
    FROM
        messages
    WHERE
        type LIKE $1
    ORDER BY
        global_position ASC
`;

const getAllStreamMessagesByType = `
    SELECT
        *
    FROM
        messages
    WHERE
        stream_name = $1
    AND
        type LIKE $2
    ORDER BY
        global_position ASC
`;

const getAllCategoryMessagesByType = `
    SELECT
        *
    FROM
        messages
    WHERE
        category(stream_name) = $1
    AND
        type LIKE $2
    ORDER BY
        global_position ASC
`;

const getAllEntityMessagesSql = `
    SELECT
        *
    FROM
        messages
    WHERE
        stream_name LIKE $1
    ORDER BY
        global_position
`;

const project = (events, projection) => {
    return events.reduce((entity, event) => {
        if (!projection[event.type]) {
            return entity;
        }

        return projection[event.type](entity, event);
    }, projection.$init());
};

const createRead = ({ db }) => {
    const readLastMessage = (streamName) => {
        return db.query(getLastMessageSql, [streamName]).then((res) => deserializeFromStringifiedJson(res.rows[0]));
    };

    const read = (streamName, fromPosition = 0, maxMessages = 1000) => {
        let query = null;
        let values = [];

        if (Array.isArray(streamName)) {
            streamName.forEach((category) => {
                if (category.includes('-')) {
                    throw new Error(`Only categories allowed for multi-subscriptions. Got: ${category}`);
                }
            });

            query = getMultipleCategoryMessagesSql;
            values = [streamName, fromPosition, maxMessages];
        } else if (streamName === '$all') {
            query = getAllMessagesSql;
            values = [fromPosition, maxMessages];
        } else if (streamName.includes('-')) {
            query = getStreamMessagesSql;
            values = [streamName, fromPosition, maxMessages];
        } else {
            query = getCategoryMessagesSql;
            values = [streamName, fromPosition, maxMessages];
        }

        return db
            .query(query, values)
            .then((res) => res.rows.map(deserializeFromStringifiedJson))
            .catch((err) => {
                console.error(err);
                return Bluebird.resolve([]);
            });
    };

    const projectMessages = (streamName, projection) => {
        return read(streamName).then((messages) => project(messages, projection));
    };

    const readById = ({ id }) => {
        return db
            .query(getOneMessageByIdSql, [id])
            .then((res) => res.rows.map(deserializeMessage))
            .then((rows) => rows[0]);
    };

    const readByMetadataAttribute = (streamName, attr, value) => {
        if (streamName === '$all') {
            return db
                .query(getAllMessagesByMetadataAttributeSql(attr), [value])
                .then((res) => res.rows.map(deserializeMessage));
        } else if (streamName.includes('-')) {
            return db
                .query(getAllStreamMessagesByMetadataAttributeSql(attr), [streamName, value])
                .then((res) => res.rows.map(deserializeMessage));
        } else {
            return db
                .query(getAllCategoryMessagesByMetadataAttributeSql(attr), [streamName, value])
                .then((res) => res.rows.map(deserializeMessage));
        }
    };

    const readByType = (streamName, type) => {
        if (streamName === '$all') {
            return db.query(getAllMessagesByType, [type]).then((res) => res.rows.map((row) => deserializeMessage(row)));
        } else if (streamName.includes('-')) {
            return db.query(getAllStreamMessagesByType, [type]).then((res) => res.rows.map(deserializeMessage));
        } else {
            return db.query(getAllCategoryMessagesByType, [type]).then((res) => res.rows.map(deserializeMessage));
        }
    };

    const readByEntity = (entityId) => {
        return db.query(getAllEntityMessagesSql, ['%' + entityId]).then((res) => res.rows.map(deserializeMessage));
    };

    return {
        read,
        readLastMessage,
        readById,
        readByMetadataAttribute,
        readByType,
        readByEntity,
        project: projectMessages,
    };
};

module.exports = createRead;
