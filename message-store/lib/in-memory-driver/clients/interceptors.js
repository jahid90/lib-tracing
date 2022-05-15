const { v4: uuid } = require('uuid');
const createLogger = require('../../logger');

const successCodes = [200, 201, 204];

const createInterceptors = ({ logLevel, clientId }) => {
    const logger = createLogger('message-store', logLevel);
    const interceptors = {
        requestInterceptor: (config) => {
            config.headers['x-client-id'] = clientId || 'message-store';
            config.headers['x-request-id'] = uuid();
            logger.debug(`req ok - ${JSON.stringify(config)}`);
            return config;
        },
        requestErrorInterceptor: (error) => {
            logger.warn(`req x - ${JSON.stringify(error)}`);
            return Promise.reject(error);
        },
        responseInterceptor: (response) => {
            if (!successCodes.includes(response.status)) {
                logger.info(`resp x - ${JSON.stringify(response.data)}`);
                return Promise.reject(response.data);
            }

            logger.debug(`resp ok - ${JSON.stringify(response.data)}`);
            return response.data;
        },
        responseErrorInterceptor: (error) => {
            logger.error(`resp x - ${JSON.stringify(error)}`);
            return Promise.reject(error);
        },
    };

    return interceptors;
};

module.exports = createInterceptors;
