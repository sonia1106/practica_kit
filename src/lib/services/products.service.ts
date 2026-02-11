import type { Product, ProductApi, ProductsResponse } from '$lib/types/products';
import { products } from '$lib/stores/products';
import { http } from '$lib/utils/http';

interface ApiResponse<T> {
    IntCodigo: number;
    oResultado: T;
    StrMensaje: string;
}

export async function obtenerProductos(): Promise<void> {
    const data = await http<ApiResponse<ProductApi[]>>('/ItemObtener/');

    products.set(data.oResultado.map(mapProductApi));
}

export async function obtenerProductoPorId(id: number): Promise<Product> {
    const data = await http<ApiResponse<ProductApi[]>>(`/ItemObtener/${id}`);

    return mapProductApi(data.oResultado[0]);
}

function mapProductApi(p: ProductApi): Product {
    return {
        id_item: p.id_item,
        descripcion: p.descripcion,
        descripcion_mini: p.descripcion_mini,
        unidad_manejo: p.unidad_manejo,
        proveedor: p.proveedor,
        gfactura: p.gfactura,
        aud_estado: p.aud_estado,
        factor_conversion1: p.factor_conversion1,
        factor_conversion2: p.factor_conversion2
    };
}
