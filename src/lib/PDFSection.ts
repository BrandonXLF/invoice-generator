import type jsPDF from 'jspdf';

export default interface PDFSection {
	/**
	 * Add this PDF section to the given document
	 *
	 * @param doc - The jsPDF document
	 * @param x - Horizontal coordinate of the section
	 * @param y - Vertical coordinate of the section
	 * @returns The height of the generated PDF section
	 */
	addTo(doc: jsPDF, x: number, y: number): number;
}
