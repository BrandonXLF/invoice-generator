import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';

export default class NoteSection implements PDFSection {
	note: string = '';

	addTo(doc: jsPDF, x: number, y: number) {
		if (!this.note) return 0;

		doc
			.setFont(undefined, 'bold')
			.text('Notes', x, y, { baseline: 'top' })
			.setFont(undefined, 'normal')
			.text(this.note, x, y + 10, { baseline: 'top' });

		return 0;
	}
}
