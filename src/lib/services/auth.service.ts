import type { LoginResponse, User } from '$lib/types/auth';
import { setUser } from '$lib/stores/auth';

const BASE_URL = 'http://127.0.0.1:30004';

export async function login(usuario: string, clave: string): Promise<User> {
    const formData = new FormData();
    formData.append('Usuario', usuario);
    formData.append('Clave', clave);

    const response = await fetch(`${BASE_URL}/Autenticacion/`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error de red al intentar autenticar');
    }

    const data: LoginResponse = await response.json();

    // Check for negative response
    if (data.IntCodigo === -1) {
        throw new Error(data.StrMensaje || 'Error de autenticación');
    }

    // Check for positive response
    if (data.IntCodigo === 1 && data.oResultado) {
        const user = data.oResultado;
        setUser(user);
        return user;
    }

    throw new Error('Respuesta inesperada del servidor');
}

export async function logout(): Promise<void> {
    const { clearUser } = await import('$lib/stores/auth');
    clearUser();
}
