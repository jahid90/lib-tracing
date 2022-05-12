import axios from 'axios';

const createClient = async ({ url }) => {
    const client = axios.create({
        baseURL: url || 'http://localhost:9999',
        timeout: 100,
    });

    const connect = async () => {
        try {
            await client.get('/ping');
        } catch (err) {
            throw new Error('unable to reach store');
        }
    };

    const getAllEvents = async () => {
        try {
            const res = await client.get('/db/events?full');
            return res.data;
        } catch (err) {
            console.error(err.message);
            throw new Error('something went wrong');
        }
    };

    const getEvent = async ({ id }) => {
        try {
            const res = await client.get(`/db/events/${id}`);
            return res.data;
        } catch (err) {
            console.error(err.message);
            throw new Error('something went wrong');
        }
    };

    await connect();

    return {
        getAllEvents,
        getEvent,
    };
};

export default createClient;
