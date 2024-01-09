import type PDFWriter from './PDFWriter';

export default interface PDFSection {
	/**
	 * Add this PDF section to the given document
	 *
	 * @param writer - The PDFWriter
	 * @param x - Horizontal coordinate of the section
	 * @returns The height of the generated PDF section
	 */
	addTo(writer: PDFWriter, x: number): void;
}
