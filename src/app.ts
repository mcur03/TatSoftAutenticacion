import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import reset from './routes/restablecercontraseña';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import redis from './config/configRedis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Cargar el archivo YAML
const swaggerDocument = YAML.load("./swagger.yaml");
// Montar la documentación Swagger en la ruta `/api-docs`
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/reset', reset);
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});



app.get("/cache", async (req, res) => {
  const data = await redis.get("mensaje");
  res.json({ mensaje: data || "No hay datos en caché" });
});

app.post("/cache", async (req, res) => {
  const { key, value } = req.body;
  await redis.set(key, value);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);

});
