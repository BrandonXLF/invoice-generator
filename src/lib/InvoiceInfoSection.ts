import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class InvoiceInfoSection implements PDFSection {
	number = 'INV-001';
	date = new Date().toISOString().split('T')[0];
	due = '';

	static labels = {
		number: 'Invoice #',
		date: 'Invoice Date',
		due: 'Due Date'
	};

	addTo(doc: jsPDF, x: number, y: number) {
		let height = 0;

		(['number', 'date', 'due'] as const).forEach((key) => {
			if (!this[key]) return;

			doc
				.text(InvoiceInfoSection.labels[key], x, y + height, {
					baseline: 'top'
				})
				.text(this[key], x + 30, y + height, { baseline: 'top' });

			height += 8;
		});

		return height;
	}
}
