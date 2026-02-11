export interface LoginRequest {
    Usuario: string;
    Clave: string;
}

export interface User {
    id: number;
    usuario: string;
    clave: string;
    nombre: string;
    id_roles_usuarios: number;
    id_turno_usuarios: number;
    ci: string;
    direccion: string;
    telefono: string;
    rol: string;
    perm1: number;
    perm2: number;
    perm3: number;
    perm4: number;
    perm5: number;
    hraing: string;
    hrasal: string;
    acceso1: string;
    acceso2: string;
    acceso3: string;
    acceso4: string;
    acceso5: string;
    acceso6: string;
    activo: boolean;
}

export interface LoginResponse {
    IntCodigo: number;
    StrMensaje: string;
    oResultado?: User;
}

export interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
}
