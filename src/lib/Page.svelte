<script lang="ts">
	import StreetAddress from './Address.svelte';
	import InvoiceInfo from './InvoiceInfo.svelte';
	import ProductTable from './ItemTable.svelte';
	import ItemTableTotals from './ItemTableTotals.svelte';
	import NoteRow from './NoteRow.svelte';
	import InvoiceTitle from './InvoiceTitle.svelte';
	import AddressSection from './AddressSection';
	import InvoiceInfoSection from './InvoiceInfoSection';
	import ItemTableSection from './ItemTableSection';
	import NoteSection from './NoteSection';
	import PDFWriter from './PDFWriter';
	import InvoiceTitleSection from './InvoiceTitleSection';

	let invoiceTitle = new InvoiceTitleSection();
	let fromAddress = new AddressSection('From');
	let billAddress = new AddressSection('Bill To');
	let invoiceInfo = new InvoiceInfoSection();
	let items = new ItemTableSection();
	let noteData = new NoteSection();
	let pageSize = 'letter';

	function generatePdf() {
		new PDFWriter(pageSize)
			.addItem(fromAddress)
			.addItem(invoiceTitle, 0, true)
			.finishRow()
			.addItem(billAddress)
			.addItem(invoiceInfo, 65, true)
			.finishRow()
			.addItem(items)
			.finishRow()
			.addItem(noteData)
			.finishRow()
			.save();
	}
</script>

<main id="page">
	<div class="row flex-row">
		<StreetAddress bind:address={fromAddress} />
		<InvoiceTitle />
	</div>
	<div class="row flex-row">
		<StreetAddress bind:address={billAddress} />
		<InvoiceInfo bind:data={invoiceInfo} />
	</div>
	<ProductTable bind:itemTable={items} />
	<ItemTableTotals bind:itemTable={items} />
	<NoteRow bind:data={noteData} />
	<div class="row button-row">
		<label>
			<span>Page Size:</span>
			<select bind:value={pageSize}>
				<option value="letter">Letter</option>
				<option value="a4">A4</option>
				<option value="legal">Legal</option>
			</select>
		</label>
		<button on:click={generatePdf}>Generate PDF</button>
	</div>
</main>

<style>
	#page {
		max-width: min(100%, 8.5in);
		max-height: 100%;
		background: white;
		color: black;
		aspect-ratio: 8.5 / 11;
		padding: 1in;
		overflow: auto;
	}

	.button-row {
		display: flex;
		align-items: center;
		gap: 1em;
	}

	:global(#page .title) {
		font-size: 125%;
		font-weight: bold;
	}

	:global(#page .row:not(:last-child)) {
		margin-bottom: 0.5in;
	}

	:global(#page .flex-row) {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 8px;
	}

	:global(#page .grid) {
		display: grid;
		align-items: start;
		gap: 8px;
	}

	:global(#page input, #page textarea) {
		color-scheme: light;
		background: #eee;
		min-width: 20px;
		border: none;
		padding: 2px;
	}

	:global(#page textarea) {
		resize: vertical;
	}

	@media (max-width: 800px), (max-height: 1000px) {
		#page {
			padding: 0.25in;
			aspect-ratio: unset;
		}
	}
</style>
