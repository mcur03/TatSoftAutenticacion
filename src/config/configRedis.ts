import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Configuración para Azure Redis
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6380"),
  password: process.env.REDIS_PASSWORD,
  tls: {
    // Azure Redis requiere TLS
    servername: process.env.REDIS_HOST
  }
});

// Manejar eventos de conexión
redis.on("connect", () => {
  console.log("Conectado a Azure Redis Cache");
});

redis.on("error", (error) => {
  console.error("Error de conexión Redis:", error);
});

// Test de conexión
redis.set("test", "Conexión exitosa a Azure Redis!", "EX", 60).then(() => {
  console.log("Test de escritura en Redis exitoso");
}).catch(err => {
  console.error("Error en test de Redis:", err);
});

export default redis;
