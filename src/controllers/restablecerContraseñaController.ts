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
        // Verificar si el usuario existe
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/email/${email}`);
        console.log('entro a la url de usuarios');
        
        if (!response.data) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar un código de 4 dígitos
        const code = crypto.randomInt(1000, 9999).toString();
        console.log('codigo: ',code);

        // Guardar el código en Redis con expiración de 10 minutos
        redis.set("test", "value", "EX", 10, (err) => {
            if (err) {
              console.error("Error conectando a Redis:", err);
            } else {
              console.log("Redis está funcionando correctamente");
            }
          });
        try {
            await redis.set(`verificationCode:${email}`, code, 'EX', 600);
            console.log('se guarada el codigo');
            
        } catch (redisError) {
            const error = redisError as Error;
            console.error('Error al conectar con Redis:', error.message);
            return res.status(500).json({ message: 'Error interno del servidor (Redis)' });
        }

        // Enviar el correo directamente desde Node.js
        await sendEmail(email, "Código de verificación", code);
        console.log('codigo enviado');
        

        res.status(200).json({ message: 'Código enviado al correo' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};


// Endpoint para Validar el Código
export const validateResetCode = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    try {
        // Obtener el código almacenado en Redis
        const storedCode = await redis.get(`verificationCode:${email}`);

        if (!storedCode) {
            res.status(400).json({ message: 'Código expirado o no encontrado' });
            return;
        }

        if (storedCode !== code) {
            res.status(400).json({ message: 'Código incorrecto' });
            return;
        }

        // Código válido
        res.status(200).json({ message: 'Código verificado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el código' });
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

