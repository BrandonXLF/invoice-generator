import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class InvoiceTitleSection implements PDFSection {
	addTo(writer: PDFWriter, x: number) {
		writer.doc.setFont(undefined, 'bold').setFontSize(28);

		writer.addText('INVOICE', x, { ...PDFWriter.TEXT_OPTS, align: 'right' });

		writer.doc.setFont(undefined, 'normal').setFontSize(12);
	}
}
