import { Router } from 'express';
import { verifyToken, authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.get(
  '/usuarios',
  verifyToken,
  authorizeRole('ADMINISTRADOR'),
  (req, res) => {
    res.json({ message: 'Lista de clientes' });
  }
);

export default router;
