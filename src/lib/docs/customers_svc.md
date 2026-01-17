# Mostrar todos los Clientes
URL: http://192.168.10.12:30004/ClienteObtener/0/0/
Method: GET
Payload: 

{
    "IntCodigo": 1,
    "oResultado": [
        {
            "aud_estado": 0,
            "aud_fecha": "/Date(-62135596800000-0000)/",
            "contacto": "",
            "direccion": "",
            "DocumentId": 0,
            "grupo": "CONSUMIDOR REGULAR",
            "id_clientes": 2,
            "id_grupo_clientes": 0,
            "nit": 6320741,
            "NitValido": false,
            "razon_social": "FREDDY",
            "telefono": ""
        },
        {
            "aud_estado": 0,
            "aud_fecha": "/Date(-62135596800000-0000)/",
            "contacto": "",
            "direccion": "",
            "DocumentId": 0,
            "grupo": "CONSUMIDOR REGULAR",
            "id_clientes": 3,
            "id_grupo_clientes": 0,
            "nit": 123456789,
            "NitValido": false,
            "razon_social": "MRI",
            "telefono": "78796541"
        },
        {
            "aud_estado": 0,
            "aud_fecha": "/Date(-62135596800000-0000)/",
            "contacto": "",
            "direccion": "",
            "DocumentId": 0,
            "grupo": "CONSUMIDOR REGULAR",
            "id_clientes": 4,
            "id_grupo_clientes": 0,
            "nit": 6362961,
            "NitValido": false,
            "razon_social": "JESÃƒÅ¡S MORENO",
            "telefono": ""
        }
    ],
    "StrMensaje": "ok"
}

# Edicion de Cliente
URL: http://192.168.10.12:30004/ClienteObtener/14
Method: GET
Payload: 

{
    "IntCodigo": 1,
    "oResultado": [
        {
            "aud_estado": 0,
            "aud_fecha": "/Date(-62135596800000-0000)/",
            "contacto": "",
            "direccion": "",
            "DocumentId": 0,
            "grupo": "CONSUMIDOR REGULAR",
            "id_clientes": 14,
            "id_grupo_clientes": 0,
            "nit": 120729026,
            "NitValido": false,
            "razon_social": "SOLUCIONES AGRICOLAS SRL",
            "telefono": "72698341"
        }
    ],
    "StrMensaje": "ok"
}

# Nuevo Cliente
URL: http://192.168.10.12:30004/ClienteOperaciones
Method: POST 
Payload: (forms)

razon_social ""
nit = ""
direccion = ""
telefono = ""
contacto = ""
id_grupo_clientes = 0
tipo = 1
id_clientes = 0
