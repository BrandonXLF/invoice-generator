import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class NoteSection implements PDFSection {
	note: string = '';

	addTo(writer: PDFWriter, x: number) {
		if (!this.note) return;

		writer
			.addText('Notes', x, { bold: true })
			.moveDown(3)
			.addText(this.note, x);
	}
}
