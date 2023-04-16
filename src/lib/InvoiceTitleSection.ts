import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class InvoiceTitleSection implements PDFSection {
	addTo(doc: jsPDF, x: number, y: number) {
		doc
			.setFont(undefined, 'bold')
			.setFontSize(28)
			.text('INVOICE', x, y, { align: 'right', baseline: 'top' })
			.setFont(undefined, 'normal')
			.setFontSize(12);

		return 20;
	}
}
