import type { LoginResponse, User } from '$lib/types/auth';
import { setUser } from '$lib/stores/auth';

// Mock user data based on PSUN API documentation
const MOCK_USER: User = {
    id: 1,
    usuario: 'admin',
    clave: 'ad513f0d423ccb3f5',
    nombre: 'USUARIO ADMINISTRADOR',
    id_roles_usuarios: 0,
    id_turno_usuarios: 3,
    ci: '123123',
    direccion: 'UNA DIRECCION',
    telefono: '77755544',
    rol: 'GESTOR IBSA',
    perm1: 1,
    perm2: 1,
    perm3: 1,
    perm4: 1,
    perm5: 1,
    hraing: '08:30',
    hrasal: '18:30',
    acceso1: '1111111111',
    acceso2: '111',
    acceso3: '111111111111111111111',
    acceso4: '111111111111111111111111111',
    acceso5: '11',
    acceso6: '100001',
    activo: false
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(usuario: string, clave: string): Promise<User> {
    // Simulate API call delay
    await delay(500);

    // Check credentials
    if (usuario === 'admin' && clave === 'petrosol@base') {
        // Simulate positive response
        const user = MOCK_USER;
        setUser(user);
        return user;
    } else {
        // Simulate negative response
        throw new Error('Usuario Inexistente.');
    }
}

export async function logout(): Promise<void> {
    const { clearUser } = await import('$lib/stores/auth');
    clearUser();
}
