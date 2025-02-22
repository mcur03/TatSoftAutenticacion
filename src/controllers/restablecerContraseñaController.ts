import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import redis from '../config/configRedis';
import { sendEmail } from "../utils/emailService";

dotenv.config();

// Endpoint para Solicitar Código
export const requestResetCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        console.log('Starting requestResetCode for email:', email);

        // Verificar si el usuario existe
        console.log('Checking user existence at:', `${process.env.USER_SERVICE_URL}/email/${email}`);
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/email/${email}`);
        
        if (!response.data) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar un código de 4 dígitos
        const code = crypto.randomInt(1000, 9999).toString();
        console.log('Generated code for email');

        // Guardar el código en Redis con expiración de 10 minutos
        try {
            const pingResult = await redis.ping();
            console.log('Redis ping result:', pingResult);
            
            await redis.set(`verificationCode:${email}`, code, 'EX', 600);
            console.log('Code saved in Redis');
        } catch (redisError) {
            console.error('Redis error details:', redisError);
            return res.status(500).json({ 
                error: 'Error interno del servidor (Redis)',
                details: redisError instanceof Error ? redisError.message : 'Unknown Redis error'
            });
        }

        // Enviar el correo directamente desde Node.js
        await sendEmail(email, "Código de verificación", code);
        console.log('codigo enviado');
        

        res.status(200).json({ message: 'Código enviado' });
    } catch (error:any) {
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
          return res.status(error.response?.status || 500).json({ error: 'Error en el microservicio de usuarios' });
    }
};


// Endpoint para Validar el Código
export const validateResetCode = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    try {
        // Obtener el código almacenado en Redis
        const storedCode = await redis.get(`verificationCode:${email}`);

        if (!storedCode) {
            res.status(400).json({ error: 'Código expirado o no encontrado' });
            return;
        }

        if (storedCode !== code) {
            res.status(400).json({ error: 'Código incorrecto' });
            return;
        }

        // Código válido
        res.status(200).json({ message: 'Código verificado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Actualizar la contraseña del usuario:
export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    console.log('passsssssssss: ', newPassword);
    console.log('emaiiiil: ', email);
    

    try {
        // Actualizar la contraseña en el microservicio de usuarios
        await axios.put(`${process.env.USER_SERVICE_URL}/update-password`, {
            correo:email,
            nuevaContraseña: newPassword,
        });

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error:any) {
        if (error.response?.status === 404) {
            res.status(404).json({ error: 'Usuario no encontrado' });
          }
          res.status(error.response?.status || 500).json({ error: 'Error en el microservicio de usuarios' });
        }
};

