<script lang="ts">
	import type AddressSection from './AddressSection';

	export let address: AddressSection;
</script>

<div class="grid">
	<div class="title">{address.title}</div>
	<input
		placeholder="Company"
		bind:value={address.name}
		on:input={(e) => address.onChange('name')}
	/>
	<input
		placeholder="Address"
		bind:value={address.street}
		on:input={(e) => address.onChange('street')}
	/>
	<input
		placeholder="Address 2"
		bind:value={address.street2}
		on:input={(e) => address.onChange('street2')}
	/>
	<input
		placeholder="City"
		bind:value={address.city}
		on:input={(e) => address.onChange('city')}
	/>
</div>
