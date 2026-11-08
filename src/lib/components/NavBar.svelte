<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import faviconSvg from '$lib/assets/favicon.svg?raw';
	import ToggleButton from '$lib/components/ToggleButton.svelte';
	import { Menu, MoonStar, SunMedium, X } from 'lucide-svelte';

	let isDarkMode = $state(false);
	let isMenuOpen = $state(false);

	$effect(() => {
		const savedVisual = localStorage.getItem('visual');

		if (savedVisual && (savedVisual === 'dark' || savedVisual === 'light')) {
			isDarkMode = savedVisual === 'dark';
		}
	});

	$effect(() => {
		document.documentElement.setAttribute('visual-theme', isDarkMode ? 'dark' : 'light');
		localStorage.setItem('visual', isDarkMode ? 'dark' : 'light');
	});
</script>

<nav>
	<a class="logo-container logo" href={resolve('/')}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html faviconSvg}
	</a>

	<ToggleButton bind:checked={isDarkMode}>
		{#snippet left()}
			<SunMedium size={24} class="icon" />
		{/snippet}

		{#snippet right()}
			<MoonStar size={24} class="icon" />
		{/snippet}
	</ToggleButton>

	<button
		type="button"
		class="menu-toggle"
		aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
		aria-expanded={isMenuOpen}
		aria-controls="main-navigation"
		onclick={() => (isMenuOpen = !isMenuOpen)}
	>
		{#if isMenuOpen}
			<X size={24} />
		{:else}
			<Menu size={24} />
		{/if}
	</button>

	<div id="main-navigation" class="nav-links" class:open={isMenuOpen}>
		<a
			href={resolve('/')}
			class="nav-link"
			class:active={page.url.pathname === '/'}
			onclick={() => (isMenuOpen = false)}>Home</a
		>
		<a
			href={resolve('/cv')}
			class="nav-link"
			class:active={page.url.pathname.startsWith('/cv')}
			onclick={() => (isMenuOpen = false)}>CV</a
		>
		<a
			href={resolve('/projects')}
			class="nav-link"
			class:active={page.url.pathname.startsWith('/projects')}
			onclick={() => (isMenuOpen = false)}>Projects</a
		>
	</div>
</nav>

<style>
	.logo-container :global(#logo-id) {
		fill: var(--color-primary) !important;
		stroke: none !important;
	}

	nav {
		display: flex;
		align-items: center;
		padding: 1rem;
		background-color: var(--color-background-notice);
		border-bottom-width: 2px;
		border-bottom-style: solid;
		border-bottom-color: var(--color-primary);
		gap: 1rem;
		position: sticky;
		top: 0;
		z-index: 1000;
	}

	.logo {
		margin-right: auto;
	}

	.nav-link {
		text-decoration: none;
	}

	.nav-link:hover {
		text-decoration: underline;
	}

	.nav-link.active {
		color: var(--color-secondary);
		font-weight: bold;
	}

	.menu-toggle {
		display: none;
		border: 0;
		padding: 0.25rem;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
	}

	.menu-toggle:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	@media (max-width: 600px) {
		nav {
			display: flex;
			flex-wrap: wrap;
			gap: 0.75rem 1rem;
			padding: 0.75rem 1rem;
		}

		.logo {
			margin-right: 0;
		}

		:global(.toggle-wrapper) {
			margin-left: auto;
		}

		.menu-toggle {
			display: inline-flex;
		}

		.nav-links {
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding-top: 0.5rem;
		}

		.nav-links.open {
			display: flex;
		}

		.nav-link {
			padding: 0.65rem 0;
		}
	}

	:global(.theme-option-label) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.theme-option-swatch) {
		display: inline-block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 0.15rem;
	}

	/* .visual-switch {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    } */
</style>
