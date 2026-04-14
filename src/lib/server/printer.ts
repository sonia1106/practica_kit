import { printer as ThermalPrinter, types as PrinterTypes } from 'node-thermal-printer';

export interface PrintData {
    usuario: string;
    bomba: string;
    fecha: string;
    detalles: Array<{
        manguera: string;
        volumen: number;
        bs: number;
    }>;
    total: number;
    pagos: Array<{
        descripcion: string;
        total: number;
    }>;
    totalRecaudado: number;
}

export class PrinterService {
    private printer: any;

    constructor(interfaceAddress: string = 'tcp://192.168.1.100') {
        this.printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: interfaceAddress,
            characterSet: 'SLOVENIA', // TM-U220 standard for common chars
            removeSpecialCharacters: false,
            width: 40 // TM-U220 impact printer width
        });
    }

    async imprimirReporte(data: PrintData) {
        try {
            const p = this.printer;
            p.clear();

            // Encabezado
            p.alignCenter();
            p.println('*** CIERRE PARCIAL ***');
            p.alignLeft();
            p.println(`Usuario: ${data.usuario}`);
            p.println(`Bomba: ${data.bomba}`);
            p.println(`Fecha Reporte: ${data.fecha}`);
            
            p.println('----------------------------------------'); // 40 dashes
            p.alignCenter();
            p.println('** DETALLE FACTURACION X MANGUERA **');
            
            // Header Tabla: MANGUERA (15), VOLUMEN (10), BS (10)
            p.alignLeft();
            p.println('MANGUERA         VOLUMEN      BS.');
            
            data.detalles.forEach(d => {
                const manguera = d.manguera.padEnd(16, ' ');
                const volumen = d.volumen.toFixed(2).padStart(10, ' ');
                const bs = d.bs.toFixed(2).padStart(10, ' ');
                p.println(`${manguera}${volumen}${bs}`);
            });

            p.alignRight();
            p.println(`TOTAL  ${data.total.toFixed(2)}`);
            p.alignLeft();
            p.println('----------------------------------------');

            p.alignCenter();
            p.println('** RECAUDACION POR FORMA DE PAGO **');
            p.alignLeft();
            p.println('DESCRIPCION            TOTAL');
            
            data.pagos.forEach(pago => {
                const desc = pago.descripcion.padEnd(21, ' ');
                const tot = pago.total.toFixed(2).padStart(10, ' ');
                p.println(`${desc}${tot}`);
            });

            p.alignRight();
            p.println(`TOTAL RECAUDADO  ${data.totalRecaudado.toFixed(2)}`);

            // Espacio al final y corte (si tiene cortadora automática)
            p.newLine();
            p.newLine();
            p.newLine();
            p.cut();

            const executeUpdate = await p.execute();
            console.log('Print job sent successfully');
            return executeUpdate;
        } catch (error) {
            console.error('Printer Error:', error);
            throw error;
        }
    }
}
