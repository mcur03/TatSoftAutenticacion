import express, { Router } from 'express';
import { login } from '../controllers/authController';

const router: Router = express.Router();

router.post('/login', (req, res, next) => {
    login(req, res).catch(next);
  });

export default router;
