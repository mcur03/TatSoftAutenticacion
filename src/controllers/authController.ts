import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL; // URL del microservicio

export const login = async (req: Request, res: Response) => {
  const { cedula, password } = req.body;

  try {
    // Consulta al microservicio
    const response = await axios.get(`${USER_SERVICE_URL}/cedula/${cedula}`);
    const user = response.data;
    
    console.log(user, 'CONTRASENA',user['contraseña'], 'ROLE',user.rol, 'ID', user.id_usuario );
    // Verifica si el usuario fue encontrado
    if (!user || !user['contraseña'] || !user.rol) {
        
      return res.status(404).json({ error: 'Usuario no encontrado o datos incompletos' });
    }

    // Verifica la contraseña
    const validPassword = await bcrypt.compare(password, user['contraseña']);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
  }
    // Genera el token
    const token = jwt.sign(
      { password: user['contraseña'], cedula: user.cedula, role: user.rol, id_usuario: user.id_usuario }, 
      process.env.JWT_SECRET ?? ' ',
      { expiresIn: '1h' }
    );

    console.log('token login',token);
    
    
    res.json({ token });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
      return res.status(error.response?.status || 500).json({ error: 'Error en el microservicio de usuarios' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
