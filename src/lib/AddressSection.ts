import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

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
				.text(this.title, x, y, PDFWriter.TEXT_OPTS)
				.setFont(undefined, 'normal');

			height += 8;
		}

		entries.forEach((str) => {
			doc.text(str, x, y + height, PDFWriter.TEXT_OPTS);
			height += 8;
		});

		return height;
	}
}
