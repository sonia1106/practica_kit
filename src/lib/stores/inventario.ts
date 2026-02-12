import { writable } from 'svelte/store';
import type { Item, Tanque, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';

export const items = writable<Item[]>([]);
export const tanques = writable<Tanque[]>([]);
export const movimientos = writable<MovimientoCabecera[]>([]);
export const movimientoSeleccionadoDetalle = writable<MovimientoDetalle[]>([]);

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { obtenerMovimientoDetalle } from '$lib/services/inventario.service';

export async function descargarPDF(mov: MovimientoCabecera, idEstacion: string = '8') {
    try {
        const detalles = await obtenerMovimientoDetalle(mov.id_transaccion);
        const doc = new jsPDF();

        // Encabezado
        doc.setFontSize(18);
        doc.text('Detalle de Movimiento', 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Nro: ${mov.id_transaccion}`, 14, 32);
        doc.text(`Fecha: ${mov.fecha ? mov.fecha.split('T')[0] : ''}`, 100, 32);
        doc.text(`Tipo: ${mov.transaccion_tipo}`, 14, 38);
        doc.text(`Estación: ${idEstacion}`, 100, 38);
        doc.text(`Referencia: ${mov.referencia || '-'}`, 14, 44);
        doc.text(`Usuario: ${mov.usuario || '-'}`, 100, 44);
        doc.text(`Proveedor/Destino: ${mov.prov || mov.origen || '-'}`, 14, 50);

        // Tabla
        autoTable(doc, {
            startY: 58,
            head: [['Producto', 'Tanque', 'Cantidad', 'Precio', 'Total']],
            body: detalles.map((d) => [
                d.producto,
                d.tanque,
                d.cantidad.toLocaleString('en-US'),
                d.precio.toFixed(2),
                d.monto_total.toLocaleString('en-US', { minimumFractionDigits: 2 })
            ])
        });

        doc.save(`movimiento-${mov.id_transaccion}.pdf`);
    } catch (e) {
        console.error('Error generando PDF', e);
        alert('Error al generar el PDF');
    }
}
