import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class AddressSection implements PDFSection {
	static ORDER = ['name', 'street', 'street2', 'city'] as const;

	name = '';
	street = '';
	street2 = '';
	city = '';
	storageKey?: string;

	constructor(
		public title: string,
		public save = false
	) {
		this.storageKey = this.save
			? this.title.toLowerCase().replace(/ /g, '-')
			: undefined;

		AddressSection.ORDER.forEach((key) => {
			if (!this.storageKey) this[key] = '';
			this[key] =
				globalThis.localStorage?.getItem(`invoice-${this.storageKey}-${key}`) ?? '';
		});
	}

	onChange(key: (typeof AddressSection.ORDER)[number]): void {
		if (this.storageKey)
			globalThis.localStorage?.setItem(`invoice-${this.storageKey}-${key}`, this[key]);
	}

	addTo(writer: PDFWriter, x: number) {
		const entries = AddressSection.ORDER.map((key) => this[key]).filter(
			(str) => str
		);

		if (entries.length) {
			writer.addText(this.title, x, { bold: true }).moveDown(3);
		}

		entries.forEach((str) => {
			writer.addText(str, x).moveDown(3);
		});
	}
}
