import type {
    ApiResponse,
    Empresa,
    Estacion,
    Playa,
    Isla,
    Dispenser,
    Lado,
    Manguera,
    Antena,
    Ciudad, // Mocking Ubicacion as Ciudad or similar generic
    Tanque,
    Equipo
} from '$lib/types/structure';

export interface Ubicacion {
    id: number;
    descripcion: string;
}

// --- Mock Data ---

const mockEmpresas: Empresa[] = [
    {
        id: 1,
        descripcion: 'Empresa Alpha',
        auxInt1: 1,
        razon_social: 'Alpha Corp S.A.',
        propietario: 'Juan Perez',
        direccion: 'Av. Principal 123',
        telefono: '555-0101'
    },
    {
        id: 2,
        descripcion: 'Empresa Beta',
        auxInt1: 1,
        razon_social: 'Beta Industries Ltda.',
        propietario: 'Maria Lopez',
        direccion: 'Calle Secundaria 456',
        telefono: '555-0202'
    },
];

const mockEstaciones: Estacion[] = [
    {
        id: 1,
        descripcion: 'Estación Central',
        id_empresas: 1,
        razon_social: 'Estacion Central S.A.',
        nit: '123456789',
        llave_mdw: 'KEY-001',
        representante_legal: 'Carlos Gomez',
        direccion: 'Av. Libertador 100',
        telefono: '555-1111',
        conectividad: 'Fibra Optica',
        tipoconectividad: 'Alta Velocidad',
        latitud: '-16.5000',
        longitud: '-68.1500',
        id_ubicacion: 1
    },
    {
        id: 2,
        descripcion: 'Estación Norte',
        id_empresas: 1,
        razon_social: 'Estacion Norte Ltda.',
        nit: '987654321',
        llave_mdw: 'KEY-002',
        representante_legal: 'Ana Diaz',
        direccion: 'Calle Norte 200',
        telefono: '555-2222',
        conectividad: '4G',
        tipoconectividad: 'Respaldo',
        latitud: '-16.4800',
        longitud: '-68.1400',
        id_ubicacion: 2
    },
    { id: 3, descripcion: 'Estación Sur', id_empresas: 2 },
];

const mockUbicaciones: Ubicacion[] = [
    { id: 1, descripcion: 'La Paz' },
    { id: 2, descripcion: 'Santa Cruz' },
    { id: 3, descripcion: 'Cochabamba' },
];

const mockAntenas: Antena[] = [
    { id: 1, descripcion: 'Antena 1', auxInt1: 1 },
    { id: 2, descripcion: 'Antena 2', auxInt1: 1 },
    { id: 3, descripcion: 'Antena 3', auxInt1: 1 },
];

const mockEquipos: Equipo[] = [
    { id: 1, descripcion: 'PC 1' },
    { id: 2, descripcion: 'PC 2' },
    { id: 3, descripcion: 'PC 3' },
    { id: 4, descripcion: 'PC 4' },
    { id: 5, descripcion: 'PC 5' },
    { id: 6, descripcion: 'PC 6' },
    { id: 7, descripcion: 'PC 7' },
    { id: 8, descripcion: 'PC 8' },
    { id: 9, descripcion: 'PC 9' },
    { id: 10, descripcion: 'PC 10' },
    { id: 11, descripcion: 'Virtual' },
];

const mockPlayas: Playa[] = [
    { id: 1, descripcion: 'Playa 1', id_estacion: 1 },
    { id: 2, descripcion: 'Playa 2', id_estacion: 1 },
    { id: 3, descripcion: 'Playa A', id_estacion: 2 },
];

const mockIslas: Isla[] = [
    { id: 1, descripcion: 'Isla 1', id_playa: 1 },
    { id: 2, descripcion: 'Isla 2', id_playa: 1 },
    { id: 3, descripcion: 'Isla 3', id_playa: 2 },
];

const mockDispensers: Dispenser[] = [
    { id: 1, descripcion: 'Dispenser 1', id_isla: 1 },
    { id: 2, descripcion: 'Dispenser 2', id_isla: 1 },
    { id: 3, descripcion: 'Dispenser 3', id_isla: 2 },
];

const mockLados: Lado[] = [
    { id: 1, descripcion: 'Lado A', id_dispenser: 1 },
    { id: 2, descripcion: 'Lado B', id_dispenser: 1 },
    { id: 3, descripcion: 'Lado A', id_dispenser: 2 },
];

const mockMangueras: Manguera[] = [
    { id: 1, descripcion: 'Manguera 1 (Super)', id_lado: 1 },
    { id: 2, descripcion: 'Manguera 2 (Regular)', id_lado: 1 },
    { id: 3, descripcion: 'Manguera 3 (Diesel)', id_lado: 2 },
];

const mockTanques: Tanque[] = [
    { id: 1, descripcion: 'TANQUE GAS NATURAL VEHICULAR' },
    { id: 2, descripcion: 'TANQUE GASOLINA PREMIUM' },
    { id: 3, descripcion: 'TQ-GE01' },
    { id: 4, descripcion: 'TQ-DO01' },
    { id: 5, descripcion: 'TQGS-01' },
    { id: 6, descripcion: 'TQSE-01' },
    { id: 7, descripcion: 'TQGE+01' },
];


// --- Helper to emulate async delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Service Functions ---

export async function obtenerEmpresa(): Promise<Empresa[]> {
    await delay(300);
    return [...mockEmpresas]; // Return copy to trigger reactivity if needed
}

export async function registrarEmpresa(empresa: Empresa): Promise<ApiResponse<any>> {
    await delay(300);
    if (empresa.id && empresa.id > 0) {
        // Edit
        const index = mockEmpresas.findIndex(e => e.id === empresa.id);
        if (index !== -1) {
            mockEmpresas[index] = { ...mockEmpresas[index], ...empresa };
        }
    } else {
        // Create
        const newId = Math.max(...mockEmpresas.map(e => e.id), 0) + 1;
        mockEmpresas.push({ ...empresa, id: newId, auxInt1: 1 });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarEmpresa(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockEmpresas.findIndex(e => e.id === id);
    if (index !== -1) {
        mockEmpresas.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerEstaciones(idEmpresa: number = 0): Promise<Estacion[]> {
    await delay(300);
    if (idEmpresa === 0) return [];
    return mockEstaciones.filter(e => e.id_empresas === idEmpresa);
}

export async function registrarEstacion(estacion: Estacion): Promise<ApiResponse<any>> {
    await delay(300);
    if (estacion.id && estacion.id > 0) {
        // Edit
        const index = mockEstaciones.findIndex(e => e.id === estacion.id);
        if (index !== -1) {
            mockEstaciones[index] = { ...mockEstaciones[index], ...estacion };
        }
    } else {
        // Create
        const newId = Math.max(...mockEstaciones.map(e => e.id || 0), 0) + 1;
        mockEstaciones.push({ ...estacion, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarEstacion(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockEstaciones.findIndex(e => e.id === id);
    if (index !== -1) {
        mockEstaciones.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerUbicaciones(): Promise<Ubicacion[]> {
    await delay(300);
    return [...mockUbicaciones];
}

export async function registrarPlaya(playa: Playa): Promise<ApiResponse<any>> {
    await delay(300);
    if (playa.id && playa.id > 0) {
        // Edit
        const index = mockPlayas.findIndex(p => p.id === playa.id);
        if (index !== -1) {
            mockPlayas[index] = { ...mockPlayas[index], ...playa };
        }
    } else {
        // Create
        const newId = Math.max(...mockPlayas.map(p => p.id || 0), 0) + 1;
        mockPlayas.push({ ...playa, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarPlaya(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockPlayas.findIndex(p => p.id === id);
    if (index !== -1) {
        mockPlayas.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerPlayas(idEstacion: number): Promise<Playa[]> {
    await delay(300);
    if (!idEstacion) return [];
    return mockPlayas.filter(p => p.id_estacion === idEstacion);
}

export async function registrarIsla(isla: Isla): Promise<ApiResponse<any>> {
    await delay(300);
    if (isla.id && isla.id > 0) {
        // Edit
        const index = mockIslas.findIndex(i => i.id === isla.id);
        if (index !== -1) {
            mockIslas[index] = { ...mockIslas[index], ...isla };
        }
    } else {
        // Create
        const newId = Math.max(...mockIslas.map(i => i.id || 0), 0) + 1;
        mockIslas.push({ ...isla, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarIsla(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockIslas.findIndex(i => i.id === id);
    if (index !== -1) {
        mockIslas.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerIslas(idPlaya: number): Promise<Isla[]> {
    await delay(300);
    if (!idPlaya) return [];
    return mockIslas.filter(i => i.id_playa === idPlaya);
}

export async function obtenerAntenas(): Promise<Antena[]> {
    await delay(300);
    return [...mockAntenas];
}

export async function obtenerDispensers(idIsla: number): Promise<Dispenser[]> {
    await delay(300);
    if (!idIsla) return [];
    return mockDispensers.filter(d => d.id_isla === idIsla);
}

export async function registrarDispenser(dispenser: Dispenser): Promise<ApiResponse<any>> {
    await delay(300);
    if (dispenser.id && dispenser.id > 0) {
        // Edit
        const index = mockDispensers.findIndex(d => d.id === dispenser.id);
        if (index !== -1) {
            mockDispensers[index] = { ...mockDispensers[index], ...dispenser };
        }
    } else {
        // Create
        const newId = Math.max(...mockDispensers.map(d => d.id || 0), 0) + 1;
        mockDispensers.push({ ...dispenser, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarDispenser(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockDispensers.findIndex(d => d.id === id);
    if (index !== -1) {
        mockDispensers.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerEquipos(): Promise<Equipo[]> {
    await delay(300);
    return [...mockEquipos];
}

export async function obtenerLados(idDispenser: number): Promise<Lado[]> {
    await delay(300);
    if (!idDispenser) return [];
    return mockLados.filter(l => l.id_dispenser === idDispenser);
}

export async function registrarLado(lado: Lado): Promise<ApiResponse<any>> {
    await delay(300);
    if (lado.id && lado.id > 0) {
        // Edit
        const index = mockLados.findIndex(l => l.id === lado.id);
        if (index !== -1) {
            mockLados[index] = { ...mockLados[index], ...lado };
        }
    } else {
        // Create
        const newId = Math.max(...mockLados.map(l => l.id || 0), 0) + 1;
        mockLados.push({ ...lado, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarLado(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockLados.findIndex(l => l.id === id);
    if (index !== -1) {
        mockLados.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerMangueras(idLado: number): Promise<Manguera[]> {
    await delay(300);
    if (!idLado) return [];
    return mockMangueras.filter(m => m.id_lado === idLado);
}

export async function registrarManguera(manguera: Manguera): Promise<ApiResponse<any>> {
    await delay(300);
    if (manguera.id && manguera.id > 0) {
        // Edit
        const index = mockMangueras.findIndex(m => m.id === manguera.id);
        if (index !== -1) {
            mockMangueras[index] = { ...mockMangueras[index], ...manguera };
        }
    } else {
        // Create
        const newId = Math.max(...mockMangueras.map(m => m.id || 0), 0) + 1;
        mockMangueras.push({ ...manguera, id: newId });
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function eliminarManguera(id: number): Promise<ApiResponse<any>> {
    await delay(300);
    const index = mockMangueras.findIndex(m => m.id === id);
    if (index !== -1) {
        mockMangueras.splice(index, 1);
    }
    return { IntCodigo: 1, oResultado: [] };
}

export async function obtenerTanques(): Promise<Tanque[]> {
    await delay(300);
    return [...mockTanques];
}
