<script lang="ts">
    import themeIds from '$lib/assets/sanzo-3-palettes.json';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import { ArrowLeftRight, House, Inbox, Newspaper, Pause, Heart, CirclePlus, SkipForward } from 'lucide-svelte';

    // This grabs the data returned from the +page.server.ts file
    let { data } = $props();
    console.log(data.topTrack);
    let topTrackTitle = data.topTrack ? data.topTrack.name : 'No top track found';
    let topTrackArtist = data.topTrack ? data.topTrack.artists.map((a: any) => a.name).join(', ') : 'Unknown artist';
    let topTrackAlbumArt = data.topTrack ? data.topTrack.album.images[0]?.url : '';
    let topTrackDurationMs = data.topTrack ? data.topTrack.duration_ms : 0;
    let topTrackDurationFormatted = formatDuration(topTrackDurationMs);
    let trackPercentage = 60
    let trackProgress = formatDuration(topTrackDurationMs * trackPercentage / 100);

    function formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

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

    let colorSources = $state(["primary", "secondary", "accent"]);

    function selectTheme(themeId: string) {
        currentTheme = themeId;
        colorSources = ["primary", "secondary", "accent"];
    }

    let paletteOrder = $state(["primary", "secondary", "accent"]);

    function swapColors(indexA: number, indexB: number) {
        const temp = colorSources[indexA];
        colorSources[indexA] = colorSources[indexB];
        colorSources[indexB] = temp;
    }
</script>

{#snippet paletteSwatch(label: string, sourceColor: string)}
    <div class="palette-swatch" style="background: var(--theme-{sourceColor});">
        <p class="palette-swatch-label">{label}</p>
    </div>
{/snippet}

<div class=header>
    <h1>The Sanzo Wada Collection</h1>
    <div class="header-sub">
        <p>Sanzo Wada was a japanese painter and costume designer, mostly known for his work on color theory, especially in japan. One very popular work is his 6-volume color studies, called Haishoku Soukan, which documented over thousand color combination. In the early 2010's, a revised ans summarised version has been published, to help fashion designers in their color-picking process. The first and very popular book, <em>A Dictionary of Color Combinations</em>, is still today widely used. While these color palettes are created for the fashion medium, it is helpful to take inspiration for Web Design.</p>
    </div>
</div>

<div class="palette-chooser">
    <div class="palette-chooser-header">
        <h2>Choose a color palette</h2>
        <CustomSelect bind:value={currentTheme} options={themeOptions} onchange={selectTheme}></CustomSelect>
    </div>
    <div 
        class="palette-chooser-body"
        color-theme={currentTheme}
        style="
            --safe-primary: var(--theme-primary);
            --safe-secondary: var(--theme-secondary);
            --safe-accent: var(--theme-accent);
        "
    >
        <div class="palette-preview">
            {@render paletteSwatch("Primary", colorSources[0])}

            <button class="swap-btn" onclick={() => swapColors(0, 1)} aria-label="Swap primary and secondary">
                <ArrowLeftRight size={20} class="icon"/>
            </button>

            {@render paletteSwatch("Secondary", colorSources[1])}

            <button class="swap-btn" onclick={() => swapColors(1, 2)} aria-label="Swap secondary and accent">
                <ArrowLeftRight size={20} class="icon"/>
            </button>

            {@render paletteSwatch("Accent", colorSources[2])}
        </div>
        <div 
        class="palette-chooser-mock"
        visual-theme="light"
        style:--theme-primary={colorSources[0] !== 'primary' ? `var(--safe-${colorSources[0]})` : null}
        style:--theme-secondary={colorSources[1] !== 'secondary' ? `var(--safe-${colorSources[1]})` : null}
        style:--theme-accent={colorSources[2] !== 'accent' ? `var(--safe-${colorSources[2]})` : null}
        >
            <div class="sidebar">
                <div class="sidebar-item"><House size={20} class="icon"/> Home</div>
                <div class="sidebar-item"><Inbox size={20} class="icon"/> Inbox</div>
                <div class="sidebar-item"><Newspaper size={20} class="icon"/> News</div>
            </div>
            <div class="mock-content">
                <div class="mock-audio-player">
                    <img src={topTrackAlbumArt} alt="Album Art" class="mock-album-art"/>
                    <div class="mock-audio-player-info">
                        <div class="mock-audio-player-header">
                            <div class="mock-audio-player-text">
                                <p class="mock-song-title">{topTrackTitle}</p>
                                <p class="mock-song-artist">{topTrackArtist}</p>
                            </div>
                            <Heart class="big-icon"/>
                            <CirclePlus class="big-icon"/>
                        </div>
                        <div class="mock-audio-player-bar">
                            <p>{trackProgress}</p>
                            <span class="mock-audio-player-bar-progress" style:--progress="{trackPercentage}%"></span>
                            <p>{topTrackDurationFormatted}</p>
                        </div>
                        <div class="mock-audio-player-controls">
                            <SkipForward class="big-icon" style="rotate: 180deg;"/>
                            <div class="mock-pause-button-container">
                                <Pause class="big-icon"/>
                            </div>
                            <SkipForward class="big-icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .palette-preview {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }

    .palette-swatch {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100px;
        border-radius: 8px;
    }

    .palette-swatch-label {
        width: 100%;
        text-align: center;
        align-self: center;
        background: color-mix(in srgb, var(--color-background) 40%, transparent);
    }

    .palette-chooser-mock {
        display: grid;
        grid-template-columns: 1fr 5fr;
        gap: 1rem;
    }
    
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background: var(--color-background-notice);
        border-radius: 0.5rem;
    }

    .sidebar-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }

    .sidebar-item:hover {
        background: var(--color-background-hover);
        transition: 0.2s ease-in-out;
    }

    .mock-audio-player {
        display: grid;
        grid-template-columns: 1fr 4fr;
        align-items: center;
        justify-content: center;
        height: fit-content;
        background: var(--color-background-notice);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 1rem;
    }

    .mock-album-art {
        width: 100%;
        height: auto;
        border-radius: 0.5rem;
    }

    .mock-audio-player-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .mock-audio-player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    .mock-audio-player-text {
        display: flex;
        flex-direction: column;
        margin-right: auto;

        > :first-child {
            font-weight: bold;
            font-size: 1.2rem;
        }

        > :last-child {
            font-size: 0.9rem;
        }
    }

    :global(.big-icon) {
        width: 2rem;
        height: auto;
        stroke: var(--color-accent);
        cursor: pointer;
    }

    .mock-audio-player-bar {
        display: flex;
        align-items: center;
        justify-items: center;
        gap: 0.5rem;

        > :first-child {
            font-size: 0.9rem;
        }

        > :last-child {
            font-size: 0.9rem;
        }
    }

    .mock-audio-player-bar-progress {
        flex-grow: 1;
        position: relative;
        display: block;
        width: 80%;
        height: 0.5rem;
        background: hsl(from var(--color-accent) h s l / 0.1);
        border-radius: 0.25rem;
        overflow: hidden;
    }

    .mock-audio-player-bar-progress::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: var(--progress);
        height: 100%;
        background-color: var(--color-accent); 
    }

    .mock-audio-player-controls {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .mock-pause-button-container {
        height: auto;
        padding: 0.5rem;
        border: 0.2rem solid var(--color-accent);
        border-radius: 50%;
    }

</style>