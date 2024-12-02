import UserRepository from '../repository/loginRepository';
import Auth from '../DTO/AuthDto';


class UserService {

    static async login(auth: Auth) {
        return await UserRepository.login(auth);
    }
}

export default UserService;