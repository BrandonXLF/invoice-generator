<script lang="ts">
	import type AddressSection from "./AddressSection";

	export let address: AddressSection;
</script>

<div class="grid">
	<div class="title">{address.title}</div>
	<input placeholder="Company" bind:value={address.name}>
	<input placeholder="Street Address" bind:value={address.street}>
	<input placeholder="City" bind:value={address.city}>
</div>