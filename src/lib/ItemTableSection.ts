import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';
import Item from './Item';
import PDFWriter from './PDFWriter';

export default class ItemTableSection implements PDFSection {
	items: Item[] = [];
	taxRate = 10;

	addItem() {
		this.items.push(new Item());
		return this;
	}

	removeItem(i: number) {
		this.items.splice(i, 1);
		return this;
	}

	get subTotal() {
		return this.items.reduce(
			(currentTotal, item) => currentTotal + item.amount,
			0
		);
	}

	get tax() {
		return this.subTotal * (this.taxRate / 100);
	}

	get total() {
		return this.subTotal + this.tax;
	}

	addTo(doc: jsPDF, x: number, y: number) {
		const cols = [
			x,
			doc.internal.pageSize.width - PDFWriter.MARGIN - 90,
			doc.internal.pageSize.width - PDFWriter.MARGIN - 60,
			doc.internal.pageSize.width - PDFWriter.MARGIN - 30
		];

		let height = this.addHeaderTo(doc, cols, y);

		for (let i = 0; i < this.items.length - 1; i++)
			height += this.addItemTo(doc, this.items[i], cols, y + height);

		this.addLineTo(doc, x, y + height);

		height += 5;
		height += this.addTotalTo(doc, cols, y + height);

		return height;
	}

	private addLineTo(doc: jsPDF, x: number, y: number) {
		doc.line(x, y, doc.internal.pageSize.width - PDFWriter.MARGIN, y);
	}

	private addHeaderTo(doc: jsPDF, cols: number[], y: number) {
		doc
			.setFont(undefined, 'bold')
			.text('Description', cols[0], y + 3, PDFWriter.TEXT_OPTS)
			.text('Quantity', cols[1], y + 3, PDFWriter.TEXT_OPTS)
			.text('Rate', cols[2], y + 3, PDFWriter.TEXT_OPTS)
			.text('Amount', cols[3], y + 3, PDFWriter.TEXT_OPTS)
			.setFont(undefined, 'normal');

		return 10;
	}

	private addItemTo(doc: jsPDF, item: Item, cols: number[], y: number) {
		this.addLineTo(doc, cols[0], y);

		doc
			.text(item.desc, cols[0], y + 3, PDFWriter.TEXT_OPTS)
			.text(item.quantity.toString(), cols[1], y + 3, PDFWriter.TEXT_OPTS)
			.text(item.rate.toFixed(2), cols[2], y + 3, PDFWriter.TEXT_OPTS)
			.text(item.amount.toFixed(2), cols[3], y + 3, PDFWriter.TEXT_OPTS);

		const lineHeight =
			doc.getFontSize() * doc.getLineHeightFactor() * (25.4 / 72);

		return lineHeight * item.desc.split('\n').length + (10 - lineHeight);
	}

	private addTotalTo(doc: jsPDF, cols: number[], y: number) {
		let height = 0;

		if (this.taxRate) {
			height += 20;

			this.addLineTo(doc, cols[2], y + 10);
			this.addLineTo(doc, cols[2], y + 20);

			doc
				.text('Sub-Total', cols[2], y + 3, PDFWriter.TEXT_OPTS)
				.text(this.subTotal.toFixed(2), cols[3], y + 3, PDFWriter.TEXT_OPTS)
				.text(`Tax (${this.taxRate}%)`, cols[2], y + 13, PDFWriter.TEXT_OPTS)
				.text(this.tax.toFixed(2), cols[3], y + 13, PDFWriter.TEXT_OPTS);
		}

		doc
			.setFont(undefined, 'bold')
			.setFontSize(16)
			.text('Total', cols[2], y + 3 + height, PDFWriter.TEXT_OPTS)
			.text(this.total.toFixed(2), cols[3], y + 3 + height, PDFWriter.TEXT_OPTS)
			.setFont(undefined, 'normal')
			.setFontSize(12);

		return height + 10;
	}
}
