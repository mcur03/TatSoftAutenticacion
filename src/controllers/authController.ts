import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:10101/api/usuarios'; // URL del microservicio

export const login = async (req: Request, res: Response) => {
  const { cedula, password } = req.body;

  try {
    // Consulta al microservicio
    const response = await axios.get(`${USER_SERVICE_URL}/cedula/${cedula}`);
    const user = response.data;

    // Verifica si el usuario fue encontrado
    if (!user || !user.contraseña || !user.rol) {
        console.log(user, 'CONTRASEÑA',user.contraseña, 'ROL',user.rol);
        
      return res.status(404).json({ message: 'Usuario no encontrado o datos incompletos' });
    }

    // Verifica la contraseña
    const validPassword = await bcrypt.compare(password, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Genera el token
    const token = jwt.sign(
      { id: user.id, cedula: user.cedula, role: user.rol },  // Usar 'rol' en lugar de 'role'
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Responde con el token
    res.json({ token });
  } catch (error) {
    // Maneja errores específicos de axios
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({ message: 'Error en el microservicio de usuarios' });
    }

    // Manejo genérico de errores
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
