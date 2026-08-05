<script lang="ts">
    import faviconSvg from '$lib/assets/favicon.svg?raw';
	import favicon from '$lib/assets/favicon.svg';
</script>

<nav>
    <div class="logo-container logo">
        {@html faviconSvg}
    </div>
    <a href="/" class="nav-link">Home</a>
	<a href="/about" class="nav-link">About</a>
	<a href="/contact" class="nav-link">Contact</a>
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
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: var(--color-primary);
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
</style>