<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	import Imprint from '$lib/components/Imprint.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="page-wrapper">
	<NavBar />

	<div class="content">
		{@render children()}
	</div>

	<div class="footer">
		<Imprint />
	</div>
</div>

<style>
	.page-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh; /* Makes the wrapper take up at least the full screen height */
	}
	.content {
		flex: 1;
		width: 100%;
		max-width: 1500px;
		margin: 0 auto;
		padding: 2rem;
	}

	.footer {
		padding: 1.5rem;
		background-color: var(--background-color-dark);
		text-align: center;
		border-top: 2px solid var(--color-primary);
	}

</style>
