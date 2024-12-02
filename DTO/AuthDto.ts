class Auth {
    private _cedula: string;
    private _contraseña: string
    constructor(
        cedula: string,
        contraseña: string
    ) {
        this._cedula = cedula;
        this._contraseña = contraseña
    }
    // Getters
    get cedula(): string {
        return this._cedula;
    }

    get contraseña(): string {
        return this._contraseña;
    }

    // Setters
    set cedula(cedula: string) {
        this._cedula = cedula;
    }

    set contraseña(contraseña: string) {
        this._contraseña = contraseña;
    }

}

export default Auth;