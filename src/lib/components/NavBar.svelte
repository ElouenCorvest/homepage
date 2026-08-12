<script lang="ts">
    import { page } from '$app/state';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import faviconSvg from '$lib/assets/favicon.svg?raw';

    const palettes = ["blue", "green"];
    let palettesObject = {};
    palettes.forEach((palette) => {
        console.log(palette)
        palettesObject[palette] = palette.charAt(0).toUpperCase() + palette.slice(1) <div></div>;
    });
    console.log(palettesObject);
    let currentTheme = $state("blue");
    let isOpen = $state(false);

    $effect(() => {
        const savedTheme = localStorage.getItem("theme");
        
        // Make sure the saved theme is actually in our list (prevents bugs if you remove a theme later)
        if (savedTheme && palettes.includes(savedTheme)) {
            currentTheme = savedTheme;
        }
    });

    $effect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
    });

    function selectTheme(theme: string) {
        console.log(theme);
        currentTheme = theme;
        isOpen = false;
    }
</script>

<nav>
    <a class="logo-container logo" href="/">
        {@html faviconSvg}
    </a>
    <CustomSelect value={palettesObject[currentTheme]} optionsObject={palettesObject} onclick={selectTheme}/>
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
        background-color: var(--background-color);
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
        color: var(--color-primary);
        font-weight: bold; 
    }

    #theme-select {
        display: flex;
        background-color: var(--background-color);
        color: var(--color-text-primary);
        border: 1px solid var(--color-primary);
        border-radius: 0.3rem;
    }

    .theme-color {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        box-sizing: border-box;
    }

</style>