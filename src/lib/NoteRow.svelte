<script lang="ts">
	import type NoteSection from './NoteSection';

	export let data: NoteSection;
</script>

<div class="row grid">
	<div class="title">Notes</div>
	<textarea bind:value={data.note} rows="5" />
</div>

<style>
	textarea {
		width: 100%;
	}
</style>
