import 'dotenv/config';
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});
console.log(process.env.REDIS_URL);

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Berhasil Tersambung ke Server Redis!'));

await redisClient.connect();

export default redisClient;