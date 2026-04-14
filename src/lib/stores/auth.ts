import { writable } from 'svelte/store';
import type { User, AuthStore } from '$lib/types/auth';

const initialState: AuthStore = {
    user: null,
    isAuthenticated: false
};

if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            initialState.user = JSON.parse(storedUser);
            initialState.isAuthenticated = true;
        } catch (e) {
            console.error('Error parsing stored user:', e);
        }
    }
}

export const authStore = writable<AuthStore>(initialState);

export function setUser(user: User) {
    authStore.set({
        user,
        isAuthenticated: true
    });

    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export function clearUser() {
    authStore.set({
        user: null,
        isAuthenticated: false
    });

    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
}

export function getUser(): User | null {
    let currentUser: User | null = null;
    authStore.subscribe(state => {
        currentUser = state.user;
    })();
    return currentUser;
}
