import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL!);

// Guardar un valor en Redis
redis.set("mensaje", "Hola desde Upstash!");

// Obtener un valor de Redis
redis.get("mensaje").then((val) => console.log("Mensaje en Redis:", val));

export default redis;
















// import Redis from 'ioredis';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configura Redis (usa variables de entorno para host y puerto)
// const redis = process.env.REDIS_URL 
//     ? new Redis(process.env.REDIS_URL, {
//         tls: { rejectUnauthorized: false } // Necesario para Redis en Azure (SSL)
//       }) 
//     : new Redis({
//         host: process.env.REDIS_HOST || '127.0.0.1',
//         port: Number(process.env.REDIS_PORT) || 6379,
//         password: process.env.REDIS_PASSWORD,
//         tls: process.env.REDIS_HOST ? { rejectUnauthorized: false } : undefined
//       });

// redis.on("connect", () => console.log("✅ Conectado a Redis"));
// redis.on("error", (err) => console.error("❌ Error en Redis:", err));

// export default redis;
