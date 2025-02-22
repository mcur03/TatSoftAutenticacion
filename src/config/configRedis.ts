import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6380"),
  password: process.env.REDIS_PASSWORD,
  tls: {
    servername: process.env.REDIS_HOST,
    rejectUnauthorized: false
  },
  retryStrategy: function(times: number) {
    if (times > 3) {
      console.error('Redis retry strategy giving up...');
      return null;
    }
    const delay = Math.min(times * 1000, 3000);
    console.log(`Redis retrying connection in ${delay}ms...`);
    return delay;
  }
};

console.log('Redis configuration:', {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  hasPassword: !!process.env.REDIS_PASSWORD
});

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;