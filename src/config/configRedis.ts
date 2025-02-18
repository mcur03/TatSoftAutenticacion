import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Configura Redis (usa variables de entorno para host y puerto)
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
});

export default redis;
