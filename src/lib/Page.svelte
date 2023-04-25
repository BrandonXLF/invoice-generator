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

	function createPDF() {
		return new PDFWriter(pageSize)
			.addItem(fromAddress)
			.addItem(invoiceTitle, 0, true)
			.finishRow()
			.addItem(billAddress)
			.addItem(invoiceInfo, 65, true)
			.finishRow()
			.addItem(items)
			.finishRow()
			.addItem(noteData)
			.finishRow();
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
		<button on:click={() => createPDF().open()}>View PDF</button>
		<button on:click={() => createPDF().save()}>Save PDF</button>
	</div>
</main>

<style>
	#page {
		width: 100%;
		max-width: 8.5in;
		min-height: min(100%, 11in);
		background: white;
		color: black;
		padding: 1in;
		overflow: auto;
	}

	.button-row {
		display: flex;
		align-items: center;
		gap: 0.5em;
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

	:global(#page input, #page textarea, #page select) {
		color-scheme: light;
		color: black;
		background: #eee;
		min-width: 20px;
		border: none;
		padding: 2px;
		margin: 0;
	}

	:global(#page textarea) {
		resize: vertical;
	}

	@media (max-width: 800px), (max-height: 800px) {
		#page {
			padding: 0.25in;
		}
	}
</style>
