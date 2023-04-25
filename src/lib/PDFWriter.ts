import jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class PDFWriter {
	static MARGIN = 25.4;

	currentY = PDFWriter.MARGIN;
	rowMax = 0;
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
	addItem(section: PDFSection, x: number = 0, fromRight = false): PDFWriter {
		x = fromRight
			? this.doc.internal.pageSize.width - x - PDFWriter.MARGIN
			: x + PDFWriter.MARGIN;

		let height = section.addTo(this.doc, x, this.currentY);

		if (height > this.rowMax) this.rowMax = height;

		return this;
	}

	/**
	 * Add items to the current row and start a new row
	 *
	 * @returns `this` for chaining methods
	 */
	finishRow(): PDFWriter {
		this.currentY += this.rowMax + PDFWriter.MARGIN / 2;
		this.rowMax = 0;

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
