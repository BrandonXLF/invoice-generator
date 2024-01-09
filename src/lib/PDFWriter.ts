import jsPDF, { type TextOptionsLight } from 'jspdf';
import type PDFSection from './PDFSection';

export default class PDFWriter {
	static MARGIN = 25.4;
	static TEXT_OPTS = { baseline: 'top' } as const;

	currentY = PDFWriter.MARGIN;
	rowMax = [0, 0];
	doc: jsPDF;

	/**
	 * Create a new PDFWriter
	 *
	 * @param pageSize The size of the page (a4, letter, etc.)
	 */
	constructor(pageSize: string) {
		this.doc = new jsPDF('p', 'mm', pageSize);
		this.doc.setFontSize(12);
	}

	/**
	 * Add a PDF section to the document
	 *
	 * @param section - The PDF section to add
	 * @param x - The horizontal position of the PDF section
	 * @param fromRight - True if `x` begins on the right side
	 * @returns `this` for chaining methods
	 */
	addSection(section: PDFSection, x: number = 0, fromRight = false): this {
		x = fromRight
			? this.doc.internal.pageSize.width - x - PDFWriter.MARGIN
			: x + PDFWriter.MARGIN;

		const originalInfo = [
			this.doc.getCurrentPageInfo().pageNumber,
			this.currentY
		];

		section.addTo(this, x);

		const newInfo = [this.doc.getCurrentPageInfo().pageNumber, this.currentY];

		if (
			newInfo[0] > this.rowMax[0] ||
			(newInfo[0] === this.rowMax[0] && newInfo[1] > this.rowMax[1])
		) {
			this.rowMax = newInfo;
		}

		this.doc.setPage(originalInfo[0]);
		this.currentY = originalInfo[1];

		return this;
	}

	moveY(y: number): this {
		this.currentY += y;

		if (this.currentY + PDFWriter.MARGIN > this.doc.internal.pageSize.height) {
			this.doc.addPage();
			this.currentY = PDFWriter.MARGIN;
		}

		return this;
	}

	addText(
		text: string,
		x: number,
		options?: TextOptionsLight,
		increaseY = true
	): this {
		const opts = { ...PDFWriter.TEXT_OPTS, ...options };

		let height =
			this.doc.getFontSize() * this.doc.getLineHeightFactor() * (254 / 720);

		if (
			this.currentY + height + PDFWriter.MARGIN >
			this.doc.internal.pageSize.height
		) {
			this.doc.addPage();
			this.currentY = PDFWriter.MARGIN;
		}

		this.doc.text(text, x, this.currentY, opts);

		if (increaseY) this.currentY += height;

		return this;
	}

	addLine(x1: number, x2: number, style?: string): this {
		this.doc.line(x1, this.currentY, x2, this.currentY, style);
		return this;
	}

	/**
	 * Add items to the current row and start a new row
	 *
	 * @returns `this` for chaining methods
	 */
	finishRow(): this {
		if (this.rowMax[0] > 0) {
			this.doc.setPage(this.rowMax[0]);
			this.currentY = this.rowMax[1];
		}

		this.moveY(PDFWriter.MARGIN / 2);
		this.rowMax = [0, 0];

		return this;
	}

	/**
	 * Save the PDF document
	 */
	save(): void {
		this.doc.save('invoice.pdf');
	}

	/**
	 * Open the PDF document in a new browser tab
	 */
	open(): void {
		window.open(this.doc.output('bloburi'));
	}
}
