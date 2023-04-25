<script lang="ts">
	import type ItemTableSection from './ItemTableSection';

	export let itemTable: ItemTableSection;
</script>

<div class="row grid" style="grid-template-columns: 3fr 1fr 1fr 1fr;">
	<div />
	<div />
	<div>Sub-Total</div>
	<output>{itemTable.subTotal.toFixed(2)}</output>
	<hr />
	<div />
	<div />
	<div>
		Tax (<input
			type="number"
			class="tax-input"
			bind:value={itemTable.taxRate}
			on:input={itemTable.taxRateChanged.bind(itemTable)}
		/>%)
	</div>
	<output>{itemTable.tax.toFixed(2)}</output>
	<hr />
	<div />
	<div />
	<div class="title">Total</div>
	<output class="title">{itemTable.total.toFixed(2)}</output>
</div>

<style>
	.tax-input {
		width: 3em;
		margin-right: 4px;
	}

	.row {
		white-space: nowrap;
	}

	hr {
		grid-column: 3 / 5;
		width: 100%;
		border: none;
		border-bottom: 1px solid #767676;
		margin: 0;
	}
</style>
