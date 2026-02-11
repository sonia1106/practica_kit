import type { Product, ProductApi } from '$lib/types/products';
import { products } from '$lib/stores/products';

// Mock products data based on PSUN API documentation
const MOCK_PRODUCTS_API: ProductApi[] = [
    {
        id_item: 11,
        descripcion: 'DIESEL ULS',
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        unidad_manejo: 'LIT',
        descripcion_mini: 'DOULS',
        id_proveedor: 1,
        id_grupo_product_fact: 1,
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 2
    },
    {
        id_item: 10,
        descripcion: 'DIESEL+',
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        unidad_manejo: 'LIT',
        descripcion_mini: 'DO+',
        id_proveedor: 1,
        id_grupo_product_fact: 1,
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 2
    },
    {
        id_item: 7,
        descripcion: 'G.ESPECIAL+',
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        unidad_manejo: 'LIT',
        descripcion_mini: 'G+',
        id_proveedor: 1,
        id_grupo_product_fact: 1,
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 2
    },
    {
        id_item: 1,
        descripcion: 'GNV',
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        unidad_manejo: 'LIT',
        descripcion_mini: 'GNV',
        id_proveedor: 1,
        id_grupo_product_fact: 1,
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 1
    }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export async function obtenerProductos(): Promise<void> {
    // Simulate API call delay
    await delay(800);

    products.set(MOCK_PRODUCTS_API.map(mapProductApi));
}

export async function obtenerProductoPorId(id: number): Promise<Product> {
    // Simulate API call delay
    await delay(300);

    const product = MOCK_PRODUCTS_API.find(p => p.id_item === id);

    if (!product) {
        throw new Error('Producto no encontrado');
    }

    return mapProductApi(product);
}
