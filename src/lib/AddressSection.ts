import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class AddressSection implements PDFSection {
	name: string = '';
	street: string = '';
	city: string = '';

	constructor(public title: string) {}

	addTo(doc: jsPDF, x: number, y: number) {
		let height = 0;
		const entries = [this.name, this.street, this.city].filter((str) => str);

		if (entries.length) {
			doc
				.setFont(undefined, 'bold')
				.text(this.title, x, y, { baseline: 'top' })
				.setFont(undefined, 'normal');

			height += 8;
		}

		entries.forEach((str) => {
			doc.text(str, x, y + height, { baseline: 'top' });
			height += 8;
		});

		return height;
	}
}
