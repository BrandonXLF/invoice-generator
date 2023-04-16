import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class AddressSection implements PDFSection {
	name: string = '';
	street: string = '';
	city: string = '';

	constructor(public title: string) {}

	addTo(doc: jsPDF, x: number, y: number) {
		doc
			.setFont(undefined, 'bold')
			.text(this.title, x, y, { baseline: 'top' })
			.setFont(undefined, 'normal')
			.text(this.name, x, y + 8, { baseline: 'top' })
			.text(this.street, x, y + 16, { baseline: 'top' })
			.text(this.city, x, y + 24, { baseline: 'top' });

		return 32;
	}
}
