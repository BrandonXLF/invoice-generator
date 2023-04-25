import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class NoteSection implements PDFSection {
	note: string = '';

	addTo(doc: jsPDF, x: number, y: number) {
		if (!this.note) return 0;

		doc
			.setFont(undefined, 'bold')
			.text('Notes', x, y, PDFWriter.TEXT_OPTS)
			.setFont(undefined, 'normal')
			.text(this.note, x, y + 10, PDFWriter.TEXT_OPTS);

		return 0;
	}
}
