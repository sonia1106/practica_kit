# Operaciones de EE.SS.
URL: http://127.0.0.1:30004/EstacionOperaciones/
Method: POST
Type: Forms
Detail: Registra una nueva EE.SS.
Edit Detail: Para modificar enviar campos: id_estaciones: ID, tipo: 3 

Payload:

id_ubicacion: 34
id_estaciones: 0
razon_social: BIGGEMAN
nit: 4712154
direccion: PAGADOR 667
llave_mdw: ABC123
representante_legal: EBIGGEMAN
telefono: 70417002
conectividad: ADSL
tipoconectividad: ADSL
latitud: 10
longitud: 10
tipo: 1
id_empresas: 10


# Operaciones de Playa
URL: http://127.0.0.1:30004/PlayaOperaciones/
Method: POST
Type: Forms
Detail: Registra una nueva playa en la EE.SS.
Edit Detail: Para modificar enviar campos: id_playas: ID, tipo: 3 

Payload:
id_playas: 0
descripcion: PLAYA 2
tipo: 1
id_estacion: 9


# Operaciones de Isla
URL: http://127.0.0.1:30004/PlayaOperaciones/
Method: POST
Type: Forms
Detail: Registra una nueva ISLA dentro una Playa de la EE.SS.
Edit Detail: Para modificar enviar campos: id_islas: ID, tipo: 3 

Payload:
id_islas: 0
descripcion: ISLA 4
id_antena: 1
tipo: 1
id_playa: 3


# Operaciones de Dispensador
URL: http://127.0.0.1:30004/DispensadorOperaciones/
Method: POST
Type: Forms
Detail: Registra un nuevo Dispensador dentro de una ISLA de la EE.SS.
Edit Detail: Para modificar enviar campos: id_dispenser: ID, tipo: 3 

Payload:
id_dispenser: 0
descripcion: DISPENSADOR 3
id_isla: 5
id_equipo: 1
habilitacion_cg: 1
cambio_precio: 1
es_autorizacion: 0
marca: GILBARCO
protocolo: RC2
tipo: 1


# Operaciones de Lado
URL: http://127.0.0.1:30004/LadoOperaciones/
Method: POST
Type: Forms
Detail: Registra un nuevo lado dentro un Dispensador  de la EE.SS.
Edit Detail: Para modificar enviar campos: id_lado_dispenser: ID, tipo: 3 

Payload:
id_lado_dispenser:0
descripcion: LADO 2
punto_abastecimiento_logico: 2
tipo: 1
id_dispenser: 8


# Operaciones de Manguera
URL: http://127.0.0.1:30004/MangueraOperaciones/
Method: POST
Type: Forms
Detail: Registra una nueva manguera dentro un Lado.
Edit Detail: Para modificar enviar campos: id_manguera: ID, tipo: 3 

Payload:
id_manguera: 0
descripcion: MANG-01
id_tanque: 23
nro_logico_manguera: 1
orden: 4
tipo: 1
id_lado: 15


# Obtiene Empresa
URL: http://127.0.0.1:30004/ParametricaObtener/3/
Type: Json
Detail: Obtiene las Empresa principal
Params:
3 - ID Parametrica Empresa

Response:

{
    "IntCodigo": 0,
    "oResultado": [
        {
            "id": 10,
            "descripcion": "EMPRESA EBEN - EZER",
            "auxInt1": 0
        }
    ]
}


# Obtener EE.SS.
URL: http://127.0.0.1:30004/ParametricaObtener/5/0/10
Type: Json
Detail: Obtiene las EE.SS. registradas
Params: 
5 - ID Parametrica EE.SS.
0 - Valor por defecto
10 - ID de la Empresa Principal

Response:
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 8,
            "descripcion": "ESTACION DE SERVICIO PIRAI SRL",
            "auxInt1": 0
        },
        {
            "id": 9,
            "descripcion": "BIGGEMAN",
            "auxInt1": 0
        }
    ]
}

# Obtener EE.SS. por ID
URL: http://127.0.0.1:30004/EstacionObtener/9
Type: Json
Detail: Obtiene una EE.SS. por ID
Params: 
9 - ID de la EE.SS.
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_estaciones": 9,
            "llave_mdw": "ABC123",
            "razon_social": "EBENZER",
            "representante_legal": "EBIGGEMAN",
            "nit": "4712154",
            "direccion": "PAGADOR 667",
            "telefono": "70417002",
            "conectividad": "ADSL",
            "tipoconectividad": "ADSL",
            "latitud": "10",
            "longitud": "10",
            "id_empresas": 10,
            "id_ubicacion": 34,
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/"
        }
    ]
}


# Obtener Playas
URL: http://127.0.0.1:30004/ParametricaObtener/6/0/9
Type: Json
Detail: Obtiene las Playas registradas
Params: 
6 - ID Parametrica de Playas.
0 - Valor por defecto
9 - ID de la EE.SS. seleccionada

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 2,
            "descripcion": "PLAYA 1",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "PLAYA 2",
            "auxInt1": 0
        }
    ]
}


# Obtener Playa por ID
URL: http://127.0.0.1:30004/PlayaObtener/3
Type: Json
Detail: Obtiene una Playa por ID
Params: 
3 - ID de la Playa
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_playas": 3,
            "descripcion": "PLAYA 2",
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/"
        }
    ]
}


# Obtener Islas
URL: http://127.0.0.1:30004/ParametricaObtener/8/0/2
Type: Json
Detail: Obtiene las Islas registradas en la Playa
Params: 
8 - ID Parametrica de Islas.
0 - Valor por defecto
2 - ID de la Playa seleccionada
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 2,
            "descripcion": "ISLA 1",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "ISLA 2",
            "auxInt1": 0
        },
        {
            "id": 4,
            "descripcion": "ISLA 3",
            "auxInt1": 0
        }
    ]
}


# Obtener Isla por ID
URL: http://127.0.0.1:30004/IslaObtener/5
Type: Json
Detail: Obtiene una Isla por ID
Params: 
5 - ID de la Isla
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_islas": 5,
            "descripcion": "ISLA 4",
            "id_playa": 3,
            "id_antena": 1,
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/"
        }
    ]
}


# Obtener Dispensers
URL: http://127.0.0.1:30004/ParametricaObtener/11/0/3
Type: Json
Detail: Obtiene los Dispenser registrados en la Isla
Params: 
11 - ID Parametrica de Dispenser.
0 - Valor por defecto
3 - ID de la Isla seleccionada
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 7,
            "descripcion": "DIS-VIRTUAL-001",
            "auxInt1": 0
        },
        {
            "id": 4,
            "descripcion": "DISPENSER 3 GE",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "DISPENSER 2 MIXTO",
            "auxInt1": 0
        }
    ]
}


# Obtener Dispenser por ID
URL: http://127.0.0.1:30004/DispenserObtener/8
Type: Json
Detail: Obtiene un Dispenser por ID
Params: 
8 - ID del Dispenser
Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_dispenser": 8,
            "descripcion": "DISPENSADOR 3",
            "id_isla": 5,
            "id_equipo": 1,
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "habilitacion_cg": 1,
            "cambio_precio": 1,
            "es_virtual": 0,
            "marca": "GILBARCO",
            "protocolo": "RC2"
        }
    ]
}


# Obtener Lados
URL: http://127.0.0.1:30004/ParametricaObtener/12/0/3
Type: Json
Detail: Obtiene los lados registrados en el Dispenser
Params: 
12 - ID Parametrica de Lados.
0 - Valor por defecto
3 - ID del Dispenser seleccionado

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 7,
            "descripcion": "LADO B",
            "auxInt1": 0
        },
        {
            "id": 6,
            "descripcion": "LADO A",
            "auxInt1": 0
        }
    ]
}


# Obtener Lado por ID
URL: http://127.0.0.1:30004/LadoObtener/15
Type: Json
Detail: Obtiene un Lado por ID
Params: 
15 - ID del Lado
Response:


{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_lado_dispenser": 15,
            "descripcion": "LADO 2",
            "id_dispenser": 8,
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "punto_abastecimiento_logico": 0
        }
    ]
}


# Obtener Mangueras 
URL: http://127.0.0.1:30004/ParametricaObtener/13/0/6
Type: Json
Detail: Obtiene las mangueras registrados en el Lado
Params: 
13 - ID Parametrica de Lados
0 - Valor por defecto
6 - ID del Lado seleccionado

Response:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 6,
            "descripcion": "GEPLUS1",
            "auxInt1": 0
        }
    ]
}


# Obtener Manguera por ID
URL: http://127.0.0.1:30004/MangueraObtener/18
Type: Json
Detail: Obtiene Manguera por ID
Params: 
18 - ID Manguera

Response:
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_manguera": 18,
            "descripcion": "MANG-01",
            "id_lado": 15,
            "id_tanque": 23,
            "aud_estado": 0,
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "nro_logico_manguera": 1,
            "orden": 4
        }
    ]
}


# Registrar Estructura
URL: http://127.0.0.1:30004/ParametricaObtener/13/0/6
Type: Forms
Detail: Registra la estructura de la EE.SS.
Payload:

id_estacion: 9

Response:

{ "IntCodigo": 1,"StrMensaje":"Estructura enviada"}


# Obtener Antenas
URL: http://127.0.0.1:30004/ParametricaObtener/7/
Type: Json
Detail: Obtiene las antenas registradas para asociar a una Isla
Payload:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "ANTENA 1",
            "auxInt1": 0
        },
        {
            "id": 10,
            "descripcion": "ANTENA 2",
            "auxInt1": 0
        }
    ]
}


# Obtener Ciudades
URL: http://127.0.0.1:30004/ParametricaObtener/4/
Type: Json
Detail: Obtiene las ciudades registradas
Payload:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 37,
            "descripcion": "SANTA CRUZ",
            "auxInt1": 0
        },
        {
            "id": 38,
            "descripcion": "TARIJA",
            "auxInt1": 0
        },
        {
            "id": 30,
            "descripcion": "BENI",
            "auxInt1": 0
        }
	]
}


# Obtener Terminales
URL: http://127.0.0.1:30004/ParametricaObtener/9/
Type: Json
Detail: Obtiene las terminales registradas
Payload:

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "PC1",
            "auxInt1": 0
        },
        {
            "id": 2,
            "descripcion": "PC2",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "PC3",
            "auxInt1": 0
        },
	]
}
