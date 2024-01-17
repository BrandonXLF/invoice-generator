import jsPDF, { type TextOptionsLight } from 'jspdf';
import type PDFSection from './PDFSection';

export type PDFWriterTextOptions = {
	bold?: boolean;
	fontSize?: number;
} & TextOptionsLight;

export default class PDFWriter {
	static MARGIN = 25.4;

	pageSize;

	private static TEXT_OPTS = { baseline: 'top' } as const;
	private static FONT_SIZE = 12;

	private currentY = PDFWriter.MARGIN;
	private rowMax = [0, 0];
	private textRowMax = [0, 0];
	private doc: jsPDF;

	/**
	 * Create a new PDFWriter
	 *
	 * @param pageSize The size of the page (a4, letter, etc.)
	 */
	constructor(pageSize: string) {
		this.doc = new jsPDF('p', 'mm', pageSize);
		this.pageSize = this.doc.internal.pageSize;

		this.doc.setFontSize(PDFWriter.FONT_SIZE);
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

	/**
	 * Move the current y position down
	 *
	 * @param y - The amount to move it down by in mm
	 * @returns `this` for chaining methods
	 */
	moveDown(y: number): this {
		this.currentY += y;

		if (this.currentY + PDFWriter.MARGIN > this.doc.internal.pageSize.height) {
			this.doc.addPage();
			this.currentY = PDFWriter.MARGIN;
		}

		return this;
	}

	/**
	 * Add text to the document
	 *
	 * @param text - The text to add
	 * @param x - The x position to add the text
	 * @param options - Options for the text
	 * @returns `this` for chaining methods
	 */
	addText(text: string, x: number, options?: PDFWriterTextOptions): this {
		const opts = { ...PDFWriter.TEXT_OPTS, ...options };

		opts.maxWidth ??=
			options?.align === 'right'
				? x - PDFWriter.MARGIN
				: this.doc.internal.pageSize.width - x - PDFWriter.MARGIN;

		const lines = text
			.split('\n')
			.flatMap((line) => this.doc.splitTextToSize(line, opts.maxWidth!));

		if (opts.bold) {
			this.doc.setFont(undefined as unknown as string, 'bold');
		}

		if (opts.fontSize !== undefined) {
			this.doc.setFontSize(opts.fontSize);
		}

		lines.forEach((line) => {
			const height = this.doc.getTextDimensions(line, opts).h;

			if (
				this.currentY + height + PDFWriter.MARGIN >
				this.doc.internal.pageSize.height
			) {
				this.doc.addPage();
				this.currentY = PDFWriter.MARGIN;
			}

			this.doc.text(line, x, this.currentY, opts);
			this.currentY += height;
		});

		if (opts.bold) {
			this.doc.setFont(undefined as unknown as string, 'normal');
		}

		if (opts.fontSize !== undefined) {
			this.doc.setFontSize(PDFWriter.FONT_SIZE);
		}

		return this;
	}

	/**
	 * Add a text cell to the text row
	 *
	 * @param text - The text to add
	 * @param x - The x position to add the text
	 * @param options - Options for the text
	 * @returns `this` for chaining methods
	 */
	addTextCell(text: string, x: number, options?: PDFWriterTextOptions): this {
		const originalInfo = [
			this.doc.getCurrentPageInfo().pageNumber,
			this.currentY
		];

		this.addText(text, x, options);

		const newInfo = [this.doc.getCurrentPageInfo().pageNumber, this.currentY];

		if (
			newInfo[0] > this.textRowMax[0] ||
			(newInfo[0] === this.textRowMax[0] && newInfo[1] > this.textRowMax[1])
		) {
			this.textRowMax = newInfo;
		}

		this.doc.setPage(originalInfo[0]);
		this.currentY = originalInfo[1];

		return this;
	}

	/**
	 * Set the current y position to the largest item in the text row and create a new row
	 *
	 * @returns `this` for chaining methods
	 */
	finishTextRow(): this {
		if (this.textRowMax[0] > 0) {
			this.doc.setPage(this.textRowMax[0]);
			this.currentY = this.textRowMax[1];
		}

		this.textRowMax = [0, 0];

		return this;
	}

	/**
	 * Add a horizontal line
	 *
	 * @param x1 - The start of the line
	 * @param x2 - The end of the line
	 * @returns `this` for chaining methods
	 */
	addLine(x1: number, x2: number): this {
		this.doc.line(x1, this.currentY, x2, this.currentY);
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

		this.moveDown(PDFWriter.MARGIN / 2);
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
