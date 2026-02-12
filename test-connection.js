// Usando fetch y FormData nativos de Node.js v22

async function testConnection() {
    console.log('Probando conexión a http://192.168.10.12:30004/MovimientoObtenerCabecera/ ...');

    const formData = new FormData();
    formData.append('ffini', '2026-01-01');
    formData.append('ffin', '2026-01-13');
    formData.append('tipo_consulta', '1');
    formData.append('id_estacion', '8');

    try {
        const response = await fetch('http://192.168.10.12:30004/MovimientoObtenerCabecera/', {
            method: 'POST',
            body: formData
        });

        console.log('Status Base:', response.status);
        if (!response.ok) {
            console.log('Error Texto:', await response.text());
        } else {
            const data = await response.json();
            console.log('Éxito! Datos recibidos:', data);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

testConnection();
