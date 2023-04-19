<script lang="ts">
	import type ItemTableSection from './ItemTableSection';

	export let itemTable: ItemTableSection;

	function onDescChange(i: number) {
		const lastRow = itemTable.items.length - 1 === i;
		const hasValues = !!itemTable.items[i].desc;

		if (lastRow && hasValues) {
			itemTable = itemTable.addItem();
			return;
		}

		if (!lastRow && !hasValues) itemTable = itemTable.removeItem(i);
	}

	itemTable.addItem();
</script>

<div class="row grid" style="grid-template-columns: 3fr 1fr 1fr 1fr;">
	<div class="header">Description</div>
	<div class="header">Quantity</div>
	<div class="header">Rate</div>
	<div class="header">Amount</div>
	{#each itemTable.items as item, i}
		<hr />
		<textarea
			rows="2"
			bind:value={item.desc}
			on:input={() => onDescChange(i)}
		/>
		<input type="number" bind:value={item.quantity} />
		<input type="number" bind:value={item.rate} />
		<output>{item.amount.toFixed(2)}</output>
	{/each}
	<hr />
</div>

<style>
	.header {
		font-size: 105%;
		font-weight: bold;
	}

	hr {
		grid-column: 1 / 5;
		width: 100%;
		border: none;
		border-bottom: 1px solid #767676;
		margin: 0;
	}
</style>
