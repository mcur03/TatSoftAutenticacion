import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import Auth from "../DTO/AuthDto";
import generateToken from "../Helpers/generateToken";
import UserService from "../services/UserService";
dotenv.config();

interface LoginRequestBody {
    cedula: string;
    contraseña: string;
  }

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cedula, contraseña } = req.body;

    const login = await UserService.login(new Auth(cedula, contraseña));

    if (login.logged) {
      return res.status(200).json({
        status: login.status,
        token: generateToken({ cedula: login.cedula }, process.env.KEY_TOKEN!, 5),
      });
    }

    return res.status(401).json({
      status: login.status,
    });
  } catch (error) {
    console.error(error);
    // En caso de error, puedes manejarlo así
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export default auth;
