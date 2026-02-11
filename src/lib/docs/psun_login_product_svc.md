# Login
URL: http://127.0.0.1:30004/Autenticacion/
Method: POST
Type: Forms

Payload:
Usuario: admin
Clave: petrosol@base

Response:

Caso Negativo:
{   
    IntCodigo: -1, 
	StrMensaje: "Usuario Inexistente."
}

Caso Positivo:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": {
        "id": 1,
        "usuario": "admin",
        "clave": "ad513f0d423ccb3f5",
        "nombre": "USUARIO ADMINISTRADOR",
        "id_roles_usuarios": 0,
        "id_turno_usuarios": 3,
        "ci": "123123",
        "direccion": "UNA DIRECCION",
        "telefono": "77755544",
        "rol": "GESTOR IBSA",
        "perm1": 1,
        "perm2": 1,
        "perm3": 1,
        "perm4": 1,
        "perm5": 1,
        "hraing": "08:30",
        "hrasal": "18:30",
        "acceso1": "1111111111",
        "acceso2": "111",
        "acceso3": "111111111111111111111",
        "acceso4": "111111111111111111111111111",
        "acceso5": "11",
        "acceso6": "100001",
        "activo": false
    }
}

# Obtener Precios
URL: http://127.0.0.1:30004/PrecioObtener/1/
Method: GET
Type: Json

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "producto": "GNV",
            "precio_lista": "NACIONAL",
            "precio_venta": 2.73,
            "fecha_actualizacion": "2017-09-30 06:26:05",
            "precio_costo": 1.55,
            "ice": 1,
            "icep": 0,
            "fecha_activacion": "2014-10-21 00:00:00",
            "id_precio_lista": 1,
            "id_precio": 26,
            "id_item": 1
        },
        {
            "producto": "GNV",
            "precio_lista": "INTERNACIONAL",
            "precio_venta": 2.95,
            "fecha_actualizacion": "2022-06-03 19:17:52",
            "precio_costo": 2.62,
            "ice": 1,
            "icep": 0,
            "fecha_activacion": "2026-01-10 00:00:01",
            "id_precio_lista": 2,
            "id_precio": 27,
            "id_item": 1
        }
    ]
}

# Obtener Precios
URL: http://127.0.0.1:30004/ItemObtener/
Method: GET
Type: Json

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_item": 11,
            "descripcion": "DIESEL ULS",
            "factor_conversion1": 1,
            "factor_conversion2": 0,
            "habilitacion1": 622919,
            "habilitacion2": 1,
            "habilitacion3": 0,
            "unidad_manejo": "LIT",
            "descripcion_mini": "DOULS",
            "id_proveedor": 1,
            "id_grupo_product_fact": 1,
            "proveedor": "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
            "gfactura": "COMBUSTIBLE",
            "aud_estado": 2
        },
        {
            "id_item": 10,
            "descripcion": "DIESEL+",
            "factor_conversion1": 1,
            "factor_conversion2": 0,
            "habilitacion1": 622919,
            "habilitacion2": 1,
            "habilitacion3": 0,
            "unidad_manejo": "LIT",
            "descripcion_mini": "DO+",
            "id_proveedor": 1,
            "id_grupo_product_fact": 1,
            "proveedor": "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
            "gfactura": "COMBUSTIBLE",
            "aud_estado": 2
        },
        {
            "id_item": 7,
            "descripcion": "G.ESPECIAL+",
            "factor_conversion1": 1,
            "factor_conversion2": 0,
            "habilitacion1": 622919,
            "habilitacion2": 1,
            "habilitacion3": 0,
            "unidad_manejo": "LIT",
            "descripcion_mini": "G+",
            "id_proveedor": 1,
            "id_grupo_product_fact": 1,
            "proveedor": "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
            "gfactura": "COMBUSTIBLE",
            "aud_estado": 2
        }
    ]
}


# Obtener Catalogo Tipo Precio
URL: http://127.0.0.1:30004/ParametricaObtener/17/
Method: GET
Type: Json

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "NACIONAL",
            "auxInt1": 0
        },
        {
            "id": 2,
            "descripcion": "INTERNACIONAL",
            "auxInt1": 0
        }
    ]
}


# Obtener Catalogo Proveedor
URL: http://127.0.0.1:30004/ParametricaObtener/29/
Method: GET
Type: Json

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
            "auxInt1": 0
        }
    ]
}


# Obtener Catalogo Tipo Producto
URL: http://127.0.0.1:30004/ParametricaObtener/28/
Method: GET
Type: Json

Response:
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "COMBUSTIBLE",
            "auxInt1": 0
        }
    ]
}


# Registra Nuevo Producto
URL: http://127.0.0.1:30004/ItemOperaciones/
Method: POST
Type: Forms
Detail: Enviar Tipo 1 para registro nuevo

Payload:

descripcion: DIESEL ULTRA	
factor_conversion1: 2
factor_conversion2: 4
habilitacion1: 1
habilitacion2: 1
habilitacion3: 1
unidad_manejo: LIT
id_proveedor: 1
id_grupo_product_fact: 1
descripcion_mini: DULTRA
tipo: 1
id_item: 0

Response:

{"IntCodigo":1,"StrMensaje":"Item Registrado."}


# Obtener Producto por ID
URL: http://127.0.0.1:30004/ItemObtener/8
Method: GET
Type: Json
Params: 
8: ID Producto

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_item": 8,
            "descripcion": "DIESEL ULTRA",
            "factor_conversion1": 2,
            "factor_conversion2": 4,
            "habilitacion1": 1,
            "habilitacion2": 1,
            "habilitacion3": 1,
            "unidad_manejo": "LIT",
            "descripcion_mini": "DULTRA",
            "id_proveedor": 1,
            "id_grupo_product_fact": 1,
            "proveedor": "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
            "gfactura": "COMBUSTIBLE",
            "aud_estado": 1
        }
    ]
}


# Editar Producto
URL: http://127.0.0.1:30004/ItemOperaciones/
Method: POST
Type: Forms
Detail: Enviar Tipo 3 para editar el producto y id_item con el ID del producto

Payload:

id_item: 8
descripcion: DIESEL ULTRA
factor_conversion1: 2
factor_conversion2: 4
habilitacion1: 1
habilitacion2: 1
habilitacion3: 1
unidad_manejo: LIT
descripcion_mini: DULTRAXX
id_proveedor: 1
id_grupo_product_fact: 1
proveedor: YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS
gfactura: COMBUSTIBLE
aud_estado: 1
tipo: 3

Response:

{IntCodigo: 1, StrMensaje: "Item Actualizado."}


# Eliminar Producto
URL: http://127.0.0.1:30004/ItemOperaciones/
Method: POST
Type: Forms
Detail: Enviar Tipo 2 para eliminar el producto y id_item con el ID del producto

Payload:

id_item: 8
tipo: 2


# Precio Operaciones
URL: http://127.0.0.1:30004/PrecioOperaciones/
Method: POST
Type: Forms
Detail: Enviar Tipo 3 para modificar el precio y id_item con el ID del producto
		id_lista_precio: 1 Nacional | 2 Internacional

Payload:

id_item: 11
descripcion: DIESEL ULS
factor_conversion1: 1
factor_conversion2: 0
habilitacion1: 622919
habilitacion2: 1
habilitacion3: 0
unidad_manejo: LIT
descripcion_mini: DOULS
id_proveedor: 1
id_grupo_product_fact: 1
proveedor: YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS
gfactura: COMBUSTIBLE
aud_estado: 2
id_lista_precio: 1
precio_item: 9.30
tipo: 3
id_usuario: 1

Response:
{IntCodigo: 1, StrMensaje: "Precio Actualizado."}

