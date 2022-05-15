const { v4: uuid } = require('uuid');

const successCodes = [200, 201, 204];

const createInterceptors = ({ debug, clientId }) => {
    const interceptors = {
        requestInterceptor: (config) => {
            config.headers['x-client-id'] = clientId || 'message-store';
            config.headers['x-request-id'] = uuid();
            debug && console.debug(`[request] [ok] ${JSON.stringify(config)}`);
            return config;
        },
        requestErrorInterceptor: (error) => {
            console.error(`[request] [fail] ${JSON.stringify(error)}`);
            return Promise.reject(error);
        },
        responseInterceptor: (response) => {
            if (!successCodes.includes(response.status)) {
                debug && console.error(`[response] [fail] ${JSON.stringify(response.data)}`);
                return Promise.reject(response.data);
            }

            debug && console.debug(`[response] [ok] ${JSON.stringify(response.data)}`);
            return response.data;
        },
        responseErrorInterceptor: (error) => {
            console.error(`[response] [fail] ${JSON.stringify(error)}`);
            return Promise.reject(error);
        },
    };

    return interceptors;
};

module.exports = createInterceptors;
