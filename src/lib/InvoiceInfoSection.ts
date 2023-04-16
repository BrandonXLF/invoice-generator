import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class InvoiceInfoSection implements PDFSection {
	number: string = '';
	date: string = '';
	due: string = '';

	addTo(doc: jsPDF, x: number, y: number) {
		doc
			.text('Invoice #', x, y, { baseline: 'top' })
			.text('Invoice Date', x, y + 8, { baseline: 'top' })
			.text('Due Date', x, y + 16, { baseline: 'top' })
			.text(this.number, x + 30, y, { baseline: 'top' })
			.text(this.date, x + 30, y + 8, { baseline: 'top' })
			.text(this.due, x + 30, y + 16, { baseline: 'top' });

		return 24;
	}
}
