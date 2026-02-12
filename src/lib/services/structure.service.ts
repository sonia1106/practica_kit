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
    Equipo,
    Tanque,
    Ubicacion,
} from '$lib/types/structure';

export type { Ubicacion };

const BASE_URL = '/backend';
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

export async function registrarEmpresa(empresa: Empresa): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/EmpresaOperaciones/`, empresa);
}

export async function eliminarEmpresa(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/EmpresaOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarEstacion(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/EstacionOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarPlaya(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/PlayaOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarIsla(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/IslaOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarDispenser(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/DispensadorOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarLado(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/LadoOperaciones/`, { id, auxInt1: 0 });
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

export async function eliminarManguera(id: number): Promise<ApiResponse<any>> {
    return postJson(`${BASE_URL}/MangueraOperaciones/`, { id, auxInt1: 0 });
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

export async function obtenerUbicaciones(): Promise<Ubicacion[]> {
    // Assuming ubicaciones use a parametric ID. Adjust if needed.
    const res = await fetchJson<ApiResponse<Ubicacion>>(`${BASE_URL}/ParametricaObtener/10/`);
    return res.oResultado;
}

export async function obtenerEquipos(): Promise<Equipo[]> {
    // Assuming equipos use a parametric ID. Adjust if needed.
    const res = await fetchJson<ApiResponse<Equipo>>(`${BASE_URL}/ParametricaObtener/14/`);
    return res.oResultado;
}

export async function obtenerTanques(): Promise<Tanque[]> {
    // Assuming tanques use a parametric ID. Adjust if needed.
    const res = await fetchJson<ApiResponse<Tanque>>(`${BASE_URL}/ParametricaObtener/15/`);
    return res.oResultado;
}

