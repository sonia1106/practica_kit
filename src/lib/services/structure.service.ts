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
    Ciudad,
    Terminal,
} from '$lib/types/structure';

const BASE_URL = 'http://127.0.0.1:30004';

// Parametric IDs
const PARAM_IDS = {
    EMPRESA: 3,
    CIUDAD: 4,
    ESTACION: 5,
    PLAYA: 6,
    ANTENA: 7,
    ISLA: 8,
    TERMINAL: 9,
    DISPENSER: 11,
    LADO: 12,
    MANGUERA: 13,
};

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return response.json();
}

async function postJson<T>(url: string, data: any): Promise<T> {
    const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    });

    if (!response.ok) {
        throw new Error(`Error posting to ${url}: ${response.statusText}`);
    }
    return response.json();
}

// --- Empresa ---
export async function obtenerEmpresa(): Promise<Empresa[]> {
    const res = await fetchJson<ApiResponse<Empresa>>(`${BASE_URL}/ParametricaObtener/${PARAM_IDS.EMPRESA}/`);
    return res.oResultado;
}

// --- Estacion (EE.SS.) ---
export async function obtenerEstaciones(idEmpresa: number = 10): Promise<Estacion[]> {
    const res = await fetchJson<ApiResponse<Estacion>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.ESTACION}/0/${idEmpresa}`
    );
    return res.oResultado;
}

export async function obtenerEstacionPorId(id: number): Promise<Estacion> {
    const res = await fetchJson<ApiResponse<Estacion>>(`${BASE_URL}/EstacionObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarEstacion(estacion: Estacion): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/EstacionOperaciones/`, estacion);
}

// --- Playa ---
export async function obtenerPlayas(idEstacion: number): Promise<Playa[]> {
    const res = await fetchJson<ApiResponse<Playa>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.PLAYA}/0/${idEstacion}`
    );
    return res.oResultado;
}

export async function obtenerPlayaPorId(id: number): Promise<Playa> {
    const res = await fetchJson<ApiResponse<Playa>>(`${BASE_URL}/PlayaObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarPlaya(playa: Playa): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/PlayaOperaciones/`, playa);
}

// --- Isla ---
export async function obtenerIslas(idPlaya: number): Promise<Isla[]> {
    const res = await fetchJson<ApiResponse<Isla>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.ISLA}/0/${idPlaya}`
    );
    return res.oResultado;
}

export async function obtenerIslaPorId(id: number): Promise<Isla> {
    const res = await fetchJson<ApiResponse<Isla>>(`${BASE_URL}/IslaObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarIsla(isla: Isla): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/PlayaOperaciones/`, isla);
}

// --- Dispenser ---
export async function obtenerDispensers(idIsla: number): Promise<Dispenser[]> {
    const res = await fetchJson<ApiResponse<Dispenser>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.DISPENSER}/0/${idIsla}`
    );
    return res.oResultado;
}

export async function obtenerDispenserPorId(id: number): Promise<Dispenser> {
    const res = await fetchJson<ApiResponse<Dispenser>>(`${BASE_URL}/DispenserObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarDispenser(dispenser: Dispenser): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/DispensadorOperaciones/`, dispenser);
}

// --- Lado ---
export async function obtenerLados(idDispenser: number): Promise<Lado[]> {
    const res = await fetchJson<ApiResponse<Lado>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.LADO}/0/${idDispenser}`
    );
    return res.oResultado;
}

export async function obtenerLadoPorId(id: number): Promise<Lado> {
    const res = await fetchJson<ApiResponse<Lado>>(`${BASE_URL}/LadoObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarLado(lado: Lado): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/LadoOperaciones/`, lado);
}

// --- Manguera ---
export async function obtenerMangueras(idLado: number): Promise<Manguera[]> {
    const res = await fetchJson<ApiResponse<Manguera>>(
        `${BASE_URL}/ParametricaObtener/${PARAM_IDS.MANGUERA}/0/${idLado}`
    );
    return res.oResultado;
}

export async function obtenerMangueraPorId(id: number): Promise<Manguera> {
    const res = await fetchJson<ApiResponse<Manguera>>(`${BASE_URL}/MangueraObtener/${id}`);
    return res.oResultado[0];
}

export async function registrarManguera(manguera: Manguera): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/MangueraOperaciones/`, manguera);
}

// --- Otros ---

export async function registrarEstructura(idEstacion: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/ParametricaObtener/13/0/6`, { id_estacion: idEstacion });
}

export async function obtenerAntenas(): Promise<Antena[]> {
    const res = await fetchJson<ApiResponse<Antena>>(`${BASE_URL}/ParametricaObtener/${PARAM_IDS.ANTENA}/`);
    return res.oResultado;
}

export async function obtenerCiudades(): Promise<Ciudad[]> {
    const res = await fetchJson<ApiResponse<Ciudad>>(`${BASE_URL}/ParametricaObtener/${PARAM_IDS.CIUDAD}/`);
    return res.oResultado;
}

export async function obtenerTerminales(): Promise<Terminal[]> {
    const res = await fetchJson<ApiResponse<Terminal>>(`${BASE_URL}/ParametricaObtener/${PARAM_IDS.TERMINAL}/`);
    return res.oResultado;
}
