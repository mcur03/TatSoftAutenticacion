import { Request } from 'express';

// Extiende la interfaz Request para incluir la propiedad "user"
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}
