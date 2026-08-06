<script lang="ts">
    import { page } from '$app/state';
    import faviconSvg from '$lib/assets/favicon.svg?raw';
</script>

<nav>
    <a class="logo-container logo" href="/">
        {@html faviconSvg}
    </a>
    <a href="/" class="nav-link" class:active={page.url.pathname === '/'}>Home</a>
	<a href="/cv" class="nav-link" class:active={page.url.pathname === '/cv'}>CV</a>
	<a href="/contact" class="nav-link" class:active={page.url.pathname === '/contact'}>Contact</a>
</nav>

<style>
    .logo-container :global(#logo-id) {
        /* Change the fill color */
        fill: var(--color-primary) !important;
        stroke: none !important;
    }

    nav {
        display: flex;
        align-items: center;
        padding: 1rem;
        background-color: var(--background-color-dark);
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: var(--color-primary);

        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .logo {
        margin-right: auto;
    }

    .nav-link {
        text-decoration: none;
        margin-right: 1rem;
    }

    .nav-link:hover {
        text-decoration: underline;
    }

    .nav-link.active {
        color: var(--color-primary);
        font-weight: bold; 
    }

</style>