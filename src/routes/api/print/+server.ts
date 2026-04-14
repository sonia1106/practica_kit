import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrinterService, type PrintData } from '$lib/server/printer';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body: { data: PrintData, interface?: string } = await request.json();
        
        // Usar la interfaz recibida o una por defecto (IP o Spooler)
        // Ejemplo de IP: 'tcp://192.168.1.100'
        // Ejemplo de Spooler Windows: 'EPSON TM-U220' (requiere que la impresora esté instalada en el servidor)
        const printerInterface = body.interface || 'tcp://192.168.1.100';
        
        const printerService = new PrinterService(printerInterface);
        await printerService.imprimirReporte(body.data);

        return json({ success: true, message: 'Impresión enviada correctamente' });
    } catch (error: any) {
        console.error('Error en API de impresión:', error);
        return json({ 
            success: false, 
            message: 'Error al imprimir: ' + error.message 
        }, { status: 500 });
    }
};
