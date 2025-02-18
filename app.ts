import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth';
import reset from './src/routes/restablecercontraseña';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Cargar el archivo YAML
const swaggerDocument = YAML.load("./docs/swagger.yaml");
console.log("Swagger cargado correctamente:", swaggerDocument);
// Montar la documentación Swagger en la ruta `/api-docs`
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/reset', reset);
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);

  console.log("Rutas registradas:", app._router.stack.map(r => r.route && r.route.path));
});
