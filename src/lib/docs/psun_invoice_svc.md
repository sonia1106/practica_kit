# Obtiene Mangueras
URL: http://127.0.0.1:30004/MangueraObtener/0/8/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_manguera": 2,
            "descripcion": "DO1",
            "id_lado": 0,
            "id_tanque": 2,
            "aud_estado": 0,
            "aud_usuario": "DIESEL",
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "nro_logico_manguera": 0,
            "orden": 0
        },
        {
            "id_manguera": 3,
            "descripcion": "DO2",
            "id_lado": 0,
            "id_tanque": 2,
            "aud_estado": 0,
            "aud_usuario": "DIESEL",
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "nro_logico_manguera": 0,
            "orden": 0
        },
        {
            "id_manguera": 12,
            "descripcion": "DO3",
            "id_lado": 0,
            "id_tanque": 2,
            "aud_estado": 0,
            "aud_usuario": "DIESEL",
            "aud_fecha": "\/Date(-62135596800000-0000)\/",
            "nro_logico_manguera": 0,
            "orden": 0
        }
    ]
}


# Obtiene Medicion
URL: http://127.0.0.1:30004/GenericosListaProcesosObtener/
Method: POST
Type: Forms
Detail: El campo long1 corresponde al ID manguera
		Los campos param7 de response corresponde al valor del Metter.
		
tipo: 1
long1: 3
string1: 2026-01-22

Payload:
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "param1": 0,
            "param2": 0,
            "param3": 69700,
            "param4": 0,
            "param7": 3076529.82,
            "param8": 0,
            "param9": 0,
            "param0": "\/Date(-62135596800000-0000)\/",
            "param11": 0,
            "param12": 0
        }
    ]
}


# Obtiene Precio Unitario
URL: http://127.0.0.1:30004/GenericosProcesosObtener/
Method: POST
Type: Forms
Detail: El campo long1 corresponde al ID de manguera 
		Los campos param7, param8 de response son los precios nacional / internacional.
		
Payload:

tipo: 1
long1: 2
long2: 1
string1: 2026-01-22

Response: 
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": {
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "param7": 9.52,
        "param8": 3.5,
        "param9": 0,
        "param0": "\/Date(-62135596800000-0000)\/",
        "param11": 0,
        "param12": 0
    }
}


# Obtiene Tipo Pago
URL: http://127.0.0.1:30004/ObtenerTipoPago/Externo/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 11,
            "descripcion": "ATC",
            "descripcion_corta": "ATC",
            "descripcion_larga": "ATC-ATC",
            "codigosin": 1
        },
        {
            "id": 4,
            "descripcion": "CHEQUE",
            "descripcion_corta": "CHE",
            "descripcion_larga": "CHE-CHEQUE",
            "codigosin": 1
        },
        {
            "id": 14,
            "descripcion": "CODIGO QR",
            "descripcion_corta": "COD",
            "descripcion_larga": "COD-CODIGO QR",
            "codigosin": 1
        },
        {
            "id": 1,
            "descripcion": "EFECTIVO",
            "descripcion_corta": "EFE",
            "descripcion_larga": "EFE-EFECTIVO",
            "codigosin": 1
        }
    ]
}


# Obtiene Tipo Consumidor
URL: http://127.0.0.1:30004/ParametricaObtener/19/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "MOTORIZADO",
            "auxInt1": 0
        },
        {
            "id": 2,
            "descripcion": "BIDON",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "BOTELLA",
            "auxInt1": 0
        },
        {
            "id": 4,
            "descripcion": "OTRO",
            "auxInt1": 0
        }
    ]
}


# Obtiene Tipo Autorizacion
URL: http://127.0.0.1:30004/ParametricaObtener/18/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "SUSTANCIAS CONTROLADAS",
            "auxInt1": 0
        }
    ]
}


# Obtiene nombre EESS
URL: http://127.0.0.1:30004/ParametricaObtener/5/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 8,
            "descripcion": "ESTACION DE SERVICIO PIRAI SRL",
            "auxInt1": 0
        }
    ]
}


# Obtiene Tipo Condicion
URL: http://127.0.0.1:30004/CondicionObtener
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 1,
            "descripcion": "10",
            "auxInt1": 0
        },
        {
            "id": 2,
            "descripcion": "8",
            "auxInt1": 0
        },
        {
            "id": 3,
            "descripcion": "2",
            "auxInt1": 0
        }       
    ]
}


# Obtiene Pais
URL: http://127.0.0.1:30004/ParametricaObtener/4/0/1/
Method: GET
Type: Json

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id": 203,
            "descripcion": "REPUBLICA CHECA",
            "auxInt1": 0
        },
        {
            "id": 275,
            "descripcion": "PALESTINA (GAZA)",
            "auxInt1": 0
        },
        {
            "id": 292,
            "descripcion": "GIBRALTAR",
            "auxInt1": 0
        }
    ]
}

# Obtiene Datos Cliente
URL: http://127.0.0.1:30004/GenericosProcesosObtener/
Method: POST
Type: Forms

Payload:
tipo: 2
string1: 3090FSF

Response:
{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": {
        "param1": 0,
        "param2": 0,
        "param3": 304456,
        "param4": 196257,
        "param5": "RIVERA",
        "param7": 0,
        "param8": 0,
        "param9": 403020,
        "param0": "\/Date(-62135596800000-0000)\/",
        "param11": 0,
        "param12": 0
    }
}


# Registra Factura Manual
URL: http://127.0.0.1:30004/FacturaManualRegistrar/
Method: POST
Type: Forms

Payload:

fecha_venta: 2026-01-22
id_tipo_pago: 1
id_precio_lista: 1
id_tipo_consumidor: 1
id_manguera: 2
nit: 403020
nombre_factura: RIVERA
id_item: 2
precio: 9.52
nro_factura: 14
id_pais: 68
id_padre:
id_usuario: 1
nro_autorizacionInt: 
nro_facturaInt: 0
monto_total: 40
id_mediciones: 69699
autoriza: 0
tipoAnulacion: 5
tipovale: 2
id_estacion: 8
tipo_int: 2
placa: 3090FSF
nro_vale: 320
nro_autorizacion: 60654540544545s4ssd4
tipo_autorizacion: 1
dependiente: 0
id_clDependiente: 0
id_transaccion: 0

Response:

{"IntCodigo":1,"StrMensaje":"Registro Existoso."}


# Registra Factura Manual Internacional
URL: http://127.0.0.1:30004/FacturaManualRegistrar/
Method: POST
Type: Forms

Payload:

fecha_venta: 2026-01-22
id_tipo_pago: 1
id_precio_lista: 2
id_tipo_consumidor: 1
id_manguera: 3
nit: 0
nombre_factura: RIVERA
id_item: 2
precio: 1.36
nro_factura: 15
id_pais: 76
id_padre: 
id_usuario: 1
nro_autorizacionInt: 33223211
nro_facturaInt: 2
monto_total: 20
id_mediciones: 69700
autoriza: 0
tipoAnulacion: 5
tipovale: 2
id_estacion: 8
tipo_int: 2
nro_autorizacion: 60654540544545s4ssd4
placa: AB12DE
dependiente: 0
id_clDependiente: 0
id_transaccion: 0

Response:

{"IntCodigo":1,"StrMensaje":"Registro Existoso."}


# Monitoreo de Transacciones
Method: GET
Type: Json
URL: http://127.0.0.1:30004/ReporteLibroVentas/2026-01-22/2026-01-22/-1/8/

{
    "IntCodigo": 1,
    "StrMensaje": "ok",
    "oResultado": [
        {
            "id_transaccion": 102,
            "nit": 403020,
            "nombre_factura": "RIVERA",
            "pais": "BOLIVIA",
            "placa": "3090FSF",
            "nro_factura": 14,
            "nro_autorizacion": "60654540544545s4ssd4",
            "fecha_venta": "22/01/2026",
            "monto_total": 40,
            "monto_descuento": 0,
            "monto_ice": 0,
            "monto_exento": 0,
            "sujeto": 40,
            "debito": 5.2,
            "estado": "V",
            "codigo_control": "0",
            "envase": "O",
            "producto": "DI",
            "autorizacion": "0",
            "cantidad": 4.2,
            "precio": 9.52,
            "tipo_credito_fiscal": 1,
            "tipo_factura": 1,
            "desc_tfactura": "M",
            "id_padre": 0,
            "id_tipo_pago": 1,
            "producto1": "DI",
            "id_precio_lista": 1,
            "manguera": "DO1",
            "id_tipo_autorizacion": 0,
            "id_item": 2,
            "nombre_factura_original": "RIVERA",
            "id_cliente": 196257,
            "id_tipo_consumidor": 1,
            "bloqueo": 0
        },
        {
            "id_transaccion": 103,
            "nit": 0,
            "nombre_factura": "CONTINGENCIA",
            "pais": "BOLIVIA",
            "placa": "3090FSF",
            "nro_factura": 16,
            "nro_autorizacion": "60654540544545s4ssd4",
            "fecha_venta": "22/01/2026",
            "monto_total": 0,
            "monto_descuento": 0,
            "monto_ice": 0,
            "monto_exento": 0,
            "sujeto": 0,
            "debito": 0,
            "estado": "C",
            "codigo_control": "0",
            "envase": "O",
            "producto": "DI",
            "autorizacion": "0",
            "cantidad": 0,
            "precio": 9.52,
            "tipo_credito_fiscal": 1,
            "tipo_factura": 1,
            "desc_tfactura": "M",
            "id_padre": 0,
            "id_tipo_pago": 1,
            "producto1": "DI",
            "id_precio_lista": 1,
            "manguera": "DO1",
            "id_tipo_autorizacion": 0,
            "id_item": 2,
            "nombre_factura_original": "RIVERA",
            "id_cliente": 196257,
            "id_tipo_consumidor": 1,
            "bloqueo": 0
        }
    ]
}