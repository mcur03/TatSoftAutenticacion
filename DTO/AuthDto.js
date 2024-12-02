"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auth {
    constructor(cedula, contraseña) {
        this._cedula = cedula;
        this._contraseña = contraseña;
    }
    // Getters
    get cedula() {
        return this._cedula;
    }
    get contraseña() {
        return this._contraseña;
    }
    // Setters
    set cedula(cedula) {
        this._cedula = cedula;
    }
    set contraseña(contraseña) {
        this._contraseña = contraseña;
    }
}
exports.default = Auth;
