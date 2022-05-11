const deserializeMessage = (rawMessage) => {
    if (!rawMessage) {
        return null;
    }

    return {
        id: rawMessage.id,
        streamName: rawMessage.streamName,
        type: rawMessage.type,
        position: rawMessage.streamPosition,
        globalPosition: rawMessage.globalPosition,
        data: rawMessage.data || {},
        metadata: rawMessage.metadata || {},
        time: rawMessage.time,
    };
};

module.exports = deserializeMessage;
