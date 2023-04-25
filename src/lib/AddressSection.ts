import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class AddressSection implements PDFSection {
	static ORDER = ['name', 'street', 'city'] as const;

	name: string;
	street: string;
	city: string;
	storageKey?: string;

	constructor(public title: string, public save = false) {
		this.storageKey = this.save
			? this.title.toLowerCase().replace(/ /g, '-')
			: null;

		this.name = this.readValue('name');
		this.street = this.readValue('street');
		this.city = this.readValue('city');
	}

	onChange(key: (typeof AddressSection.ORDER)[number]): void {
		if (this.storageKey)
			localStorage.setItem(`invoice-${this.storageKey}-${key}`, this[key]);
	}

	readValue(key: string): string {
		return (
			(this.storageKey &&
				localStorage.getItem(`invoice-${this.storageKey}-${key}`)) ||
			''
		);
	}

	addTo(doc: jsPDF, x: number, y: number) {
		let height = 0;
		const entries = AddressSection.ORDER.map((key) => this[key]).filter(
			(str) => str
		);

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
