import db from '../config/db';
import Auth from '../DTO/AuthDto';
import bcrypt from 'bcryptjs';



class UserRepository {

    static async login(auth: Auth){
        const sql = 'SELECT cedula, contraseña FROM usuarios WHERE cedula=?';
        const values = [auth.cedula];
        const result: any = await db.execute(sql, values);
        if (result[0].length > 0){
          const isPasswordValid = await bcrypt.compare(auth.contraseña, result[0][0].contraseña);
          if (isPasswordValid){
            return {logged: true, status: "Successful authentication", cedula: result[0][0].cedula}
          }
          return {logged: false, status: "Invalid username or password" };
        }
        return {logged: false, status: "Invalid username or password" };
    }
}


export default UserRepository;