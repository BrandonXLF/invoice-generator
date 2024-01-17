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
			.addTextCell('Description', cols[0])
			.addTextCell('Quantity', cols[1])
			.addTextCell('Rate', cols[2])
			.addTextCell('Amount', cols[3])
			.finishTextRow()
			.moveDown(3);

		writer.doc.setFont(undefined as unknown as string, 'normal');
	}

	private addItemTo(writer: PDFWriter, item: Item, cols: number[]) {
		writer
			.addLine(cols[0], writer.doc.internal.pageSize.width - PDFWriter.MARGIN)
			.moveDown(3)
			.addTextCell(item.desc, cols[0], {
				...PDFWriter.TEXT_OPTS,
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
				.addLine(cols[2], writer.doc.internal.pageSize.width - PDFWriter.MARGIN)
				.moveDown(3)
				.addTextCell(`Tax (${this.taxRate}%)`, cols[2])
				.addTextCell(this.tax.toFixed(2), cols[3])
				.finishTextRow()
				.moveDown(3)
				.addLine(
					cols[2],
					writer.doc.internal.pageSize.width - PDFWriter.MARGIN
				);
		}

		writer.doc.setFont(undefined as unknown as string, 'bold').setFontSize(16);

		writer
			.moveDown(3)
			.addTextCell('Total', cols[2])
			.addTextCell(this.total.toFixed(2), cols[3])
			.finishTextRow();

		writer.doc
			.setFont(undefined as unknown as string, 'normal')
			.setFontSize(12);
	}
}
