import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';

// Middleware de validación
const validateRequest: RequestHandler[] = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('code').optional().isNumeric().withMessage('El código debe ser numérico'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() }); 
        } else {
            next();
        }
    },
];

export { validateRequest };
