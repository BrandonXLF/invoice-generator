import type jsPDF from 'jspdf';
import type PDFSection from './PDFSection';
import PDFWriter from './PDFWriter';

export default class InvoiceTitleSection implements PDFSection {
	addTo(doc: jsPDF, x: number, y: number) {
		doc
			.setFont(undefined, 'bold')
			.setFontSize(28)
			.text('INVOICE', x, y, { ...PDFWriter.TEXT_OPTS, align: 'right' })
			.setFont(undefined, 'normal')
			.setFontSize(12);

		return 20;
	}
}
