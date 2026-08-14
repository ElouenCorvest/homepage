<script lang="ts">
    import { page } from '$app/state';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import faviconSvg from '$lib/assets/favicon.svg?raw';
    import ToggleButton from '$lib/components/ToggleButton.svelte';
    import { MoonStar, SunMedium } from 'lucide-svelte';
    import themeIds from '$lib/assets/sanzo-palettes.json';

    function buildThemeLabel(themeId: string): string {
        const label = themeId.charAt(0).toUpperCase() + themeId.slice(1);
        return `
            <span class="theme-option-label">
                <span>${label}</span>
                <span class="theme-option-swatch" color-theme="${themeId}" style="background: var(--theme-primary);"></span>
                <span class="theme-option-swatch" color-theme="${themeId}" style="background: var(--theme-secondary);"></span>
                <span class="theme-option-swatch" color-theme="${themeId}" style="background: var(--theme-accent);"></span>
            </span>
        `;
    }

    let currentTheme = $state(themeIds[0]);

    let themeOptions =
        themeIds
            .map((themeId) => ({
                id: themeId,
                label: buildThemeLabel(themeId),
            }));

    let isDarkMode = $state(true);

    $effect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedVisual = localStorage.getItem('visual');

        if (savedTheme && themeIds.includes(savedTheme)) {
            currentTheme = savedTheme;
        }
        
        if (savedVisual && (savedVisual === "dark" || savedVisual === "light")) {
            isDarkMode = savedVisual === "dark";
        }
    });

    $effect(() => {
        document.documentElement.setAttribute('color-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);

        document.documentElement.setAttribute('visual-theme', isDarkMode ? "dark" : "light");
        localStorage.setItem('visual', isDarkMode ? "dark" : "light");
    });

    function selectTheme(themeId: string) {
        currentTheme = themeId;
    }
</script>

<nav>
    <a class="logo-container logo" href="/">
        {@html faviconSvg}
    </a>

    <div class="visual-switch">
        <SunMedium size={24} class="icon"/>
        <ToggleButton bind:checked={isDarkMode}/>
        <MoonStar size={24} class="icon"/>
    </div>
   

    <CustomSelect bind:value={currentTheme} options={themeOptions} onchange={selectTheme} />

    <a href="/" class="nav-link" class:active={page.url.pathname === '/'}>Home</a>
    <a href="/cv" class="nav-link" class:active={page.url.pathname.startsWith('/cv')}>CV</a>
    <a href="/contact" class="nav-link" class:active={page.url.pathname.startsWith('/contact')}>Contact</a>
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

    .visual-switch {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>