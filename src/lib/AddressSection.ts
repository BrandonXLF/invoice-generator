import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class AddressSection implements PDFSection {
	static ORDER = ['name', 'street', 'street2', 'city'] as const;

	name: string;
	street: string;
	street2: string;
	city: string;
	storageKey?: string;

	constructor(public title: string, public save = false) {
		this.storageKey = this.save
			? this.title.toLowerCase().replace(/ /g, '-')
			: null;

		AddressSection.ORDER.forEach((key) => {
			if (!this.storageKey) this[key] = '';
			this[key] = localStorage.getItem(`invoice-${this.storageKey}-${key}`);
		});
	}

	onChange(key: (typeof AddressSection.ORDER)[number]): void {
		if (this.storageKey)
			localStorage.setItem(`invoice-${this.storageKey}-${key}`, this[key]);
	}

	addTo(writer: PDFWriter, x: number) {
		const entries = AddressSection.ORDER.map((key) => this[key]).filter(
			(str) => str
		);

		if (entries.length) {
			writer.doc.setFont(undefined, 'bold');

			writer.addText(this.title, x, PDFWriter.TEXT_OPTS).moveY(3);

			writer.doc.setFont(undefined, 'normal');
		}

		entries.forEach((str) => {
			writer.addText(str, x, PDFWriter.TEXT_OPTS).moveY(3);
		});
	}
}
