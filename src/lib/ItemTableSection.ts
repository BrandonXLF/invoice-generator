import type PDFSection from './PDFSection';
import Item from './Item';
import PDFWriter from './PDFWriter';

export default class ItemTableSection implements PDFSection {
	items: Item[] = [];
	taxRate: number = parseFloat(
		localStorage.getItem('invoice-tax-rate') ?? '10'
	);

	taxRateChanged() {
		localStorage.setItem('invoice-tax-rate', this.taxRate.toString());
	}

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

	addTo(writer: PDFWriter, x: number) {
		const cols = [
			x,
			writer.doc.internal.pageSize.width - PDFWriter.MARGIN - 90,
			writer.doc.internal.pageSize.width - PDFWriter.MARGIN - 60,
			writer.doc.internal.pageSize.width - PDFWriter.MARGIN - 30
		];

		this.addHeaderTo(writer, cols);

		for (let i = 0; i < this.items.length - 1; i++)
			this.addItemTo(writer, this.items[i], cols);

		writer.addLine(x, writer.doc.internal.pageSize.width - PDFWriter.MARGIN);

		this.addTotalTo(writer, cols);
	}

	private addHeaderTo(writer: PDFWriter, cols: number[]) {
		writer.doc.setFont(undefined as unknown as string, 'bold');

		writer
			.addText('Description', cols[0], PDFWriter.TEXT_OPTS, false)
			.addText('Quantity', cols[1], PDFWriter.TEXT_OPTS, false)
			.addText('Rate', cols[2], PDFWriter.TEXT_OPTS, false)
			.addText('Amount', cols[3], PDFWriter.TEXT_OPTS)
			.moveY(3);

		writer.doc.setFont(undefined as unknown as string, 'normal');
	}

	private addItemTo(writer: PDFWriter, item: Item, cols: number[]) {
		writer
			.addLine(cols[0], writer.doc.internal.pageSize.width - PDFWriter.MARGIN)
			.moveY(3)
			.addText(item.quantity.toString(), cols[1], PDFWriter.TEXT_OPTS, false)
			.addText(item.rate.toFixed(2), cols[2], PDFWriter.TEXT_OPTS, false)
			.addText(item.amount.toFixed(2), cols[3], PDFWriter.TEXT_OPTS, false)
			.addText(item.desc, cols[0], {
				...PDFWriter.TEXT_OPTS,
				maxWidth: cols[1] - cols[0] - 3
			})
			.moveY(3);
	}

	private addTotalTo(writer: PDFWriter, cols: number[]) {
		writer.moveY(5);

		if (this.taxRate) {
			writer
				.moveY(3)
				.addText('Sub-Total', cols[2], PDFWriter.TEXT_OPTS, false)
				.addText(this.subTotal.toFixed(2), cols[3], PDFWriter.TEXT_OPTS)
				.moveY(3)
				.addLine(cols[2], writer.doc.internal.pageSize.width - PDFWriter.MARGIN)
				.moveY(3)
				.addText(`Tax (${this.taxRate}%)`, cols[2], PDFWriter.TEXT_OPTS, false)
				.addText(this.tax.toFixed(2), cols[3], PDFWriter.TEXT_OPTS)
				.moveY(3)
				.addLine(
					cols[2],
					writer.doc.internal.pageSize.width - PDFWriter.MARGIN
				);
		}

		writer.doc.setFont(undefined as unknown as string, 'bold').setFontSize(16);

		writer
			.moveY(3)
			.addText('Total', cols[2], PDFWriter.TEXT_OPTS, false)
			.addText(this.total.toFixed(2), cols[3], PDFWriter.TEXT_OPTS);

		writer.doc
			.setFont(undefined as unknown as string, 'normal')
			.setFontSize(12);
	}
}
