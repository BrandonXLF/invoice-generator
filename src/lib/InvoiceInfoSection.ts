import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class InvoiceInfoSection implements PDFSection {
	number = 'INV-001';
	date = new Date().toISOString().split('T')[0];
	due = '';

	static labels = {
		number: 'Invoice #',
		date: 'Invoice Date',
		due: 'Due Date'
	};

	addTo(writer: PDFWriter, x: number) {
		(['number', 'date', 'due'] as const).forEach((key) => {
			if (!this[key]) return;

			writer
				.addTextCell(InvoiceInfoSection.labels[key], x)
				.addTextCell(this[key], x + 30)
				.finishTextRow()
				.moveDown(3);
		});
	}
}
