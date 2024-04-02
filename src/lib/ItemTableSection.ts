import type PDFSection from './PDFSection';
import Item from './Item';
import PDFWriter from './PDFWriter';

export default class ItemTableSection implements PDFSection {
	items: Item[] = [];
	taxRate: number = parseFloat(
		globalThis.localStorage?.getItem('invoice-tax-rate') ?? '10'
	);

	taxRateChanged() {
		globalThis.localStorage?.setItem('invoice-tax-rate', this.taxRate.toString());
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
			writer.pageSize.width - PDFWriter.MARGIN - 90,
			writer.pageSize.width - PDFWriter.MARGIN - 60,
			writer.pageSize.width - PDFWriter.MARGIN - 30
		];

		this.addHeaderTo(writer, cols);

		for (let i = 0; i < this.items.length - 1; i++)
			this.addItemTo(writer, this.items[i], cols);

		writer.addLine(x, writer.pageSize.width - PDFWriter.MARGIN);

		this.addTotalTo(writer, cols);
	}

	private addHeaderTo(writer: PDFWriter, cols: number[]) {
		writer
			.addTextCell('Description', cols[0], { bold: true })
			.addTextCell('Quantity', cols[1], { bold: true })
			.addTextCell('Rate', cols[2], { bold: true })
			.addTextCell('Amount', cols[3], { bold: true })
			.finishTextRow()
			.moveDown(3);
	}

	private addItemTo(writer: PDFWriter, item: Item, cols: number[]) {
		writer
			.addLine(cols[0], writer.pageSize.width - PDFWriter.MARGIN)
			.moveDown(3)
			.addTextCell(item.desc, cols[0], {
				maxWidth: cols[1] - cols[0] - 3
			})
			.addTextCell(item.quantity.toString(), cols[1])
			.addTextCell(item.rate.toFixed(2), cols[2])
			.addTextCell(item.amount.toFixed(2), cols[3])
			.finishTextRow()
			.moveDown(3);
	}

	private addTotalTo(writer: PDFWriter, cols: number[]) {
		writer.moveDown(5);

		if (this.taxRate) {
			writer
				.moveDown(3)
				.addTextCell('Sub-Total', cols[2])
				.addTextCell(this.subTotal.toFixed(2), cols[3])
				.finishTextRow()
				.moveDown(3)
				.addLine(cols[2], writer.pageSize.width - PDFWriter.MARGIN)
				.moveDown(3)
				.addTextCell(`Tax (${this.taxRate}%)`, cols[2])
				.addTextCell(this.tax.toFixed(2), cols[3])
				.finishTextRow()
				.moveDown(3)
				.addLine(cols[2], writer.pageSize.width - PDFWriter.MARGIN);
		}

		writer
			.moveDown(3)
			.addTextCell('Total', cols[2], { bold: true, fontSize: 16 })
			.addTextCell(this.total.toFixed(2), cols[3], { bold: true, fontSize: 16 })
			.finishTextRow();
	}
}
