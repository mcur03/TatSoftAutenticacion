import express from "express";
import auth from "../controllers/auth-controller"

const router = express.Router();

router.post('/login', auth);

export default router;
