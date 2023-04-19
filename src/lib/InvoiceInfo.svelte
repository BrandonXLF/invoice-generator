<script lang="ts">
	import type InvoiceInfoSection from './InvoiceInfoSection';

	export let data: InvoiceInfoSection;
</script>

<div class="grid" style="grid-template-columns: auto auto;">
	<div>Invoice #</div>
	<input bind:value={data.number} />
	<div>Invoice Date</div>
	<input bind:value={data.date} />
	<div>Due Date</div>
	<input bind:value={data.due} />
</div>
