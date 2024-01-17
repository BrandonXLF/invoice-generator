import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class InvoiceTitleSection implements PDFSection {
	addTo(writer: PDFWriter, x: number) {
		writer.addText('INVOICE', x, { align: 'right', bold: true, fontSize: 28 });
	}
}
