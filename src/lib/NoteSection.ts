import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class NoteSection implements PDFSection {
	note: string = '';

	addTo(writer: PDFWriter, x: number) {
		if (!this.note) return;

		writer.doc.setFont(undefined, 'bold');

		writer.addText('Notes', x, PDFWriter.TEXT_OPTS);

		writer.doc.setFont(undefined, 'normal');

		writer.moveY(3).addText(this.note, x, PDFWriter.TEXT_OPTS);
	}
}
