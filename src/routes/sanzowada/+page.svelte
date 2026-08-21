<script lang="ts">
    import themeIds from '$lib/assets/sanzo-3-palettes.json';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import ToggleButton from '$lib/components/ToggleButton.svelte';
    import { ArrowLeftRight, House, Inbox, Newspaper, Pause, Heart, CirclePlus, SkipForward, Angry, Frown, Meh, Smile} from 'lucide-svelte';

    function getTimeAgo(dateString) {
        const pastDate = new Date(dateString);
        const now = new Date(); // Gets the exact current time

        // 1. Calculate Total Days Ago (Using milliseconds)
        const diffInMs = Math.abs(now.getTime() - pastDate.getTime());
        const totalDaysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // 2. Calculate Total Months Ago
        let totalMonthsAgo = (now.getFullYear() - pastDate.getFullYear()) * 12;
        totalMonthsAgo -= pastDate.getMonth();
        totalMonthsAgo += now.getMonth();
        
        // Adjust if the current day of the month hasn't passed the past day yet
        if (now.getDate() < pastDate.getDate()) {
            totalMonthsAgo--;
        }

        // 3. Calculate Total Years Ago
        let totalYearsAgo = now.getFullYear() - pastDate.getFullYear();
        
        // Adjust if the current month/day hasn't passed the past month/day yet
        if (now.getMonth() < pastDate.getMonth() || 
        (now.getMonth() === pastDate.getMonth() && now.getDate() < pastDate.getDate())) {
            totalYearsAgo--;
        }

        return {
            days: totalDaysAgo,
            months: Math.max(0, totalMonthsAgo),
            years: Math.max(0, totalYearsAgo)
        };
    }

    function formatWeight(weightInKg, isLbs) {
        if (isLbs) {
            return (weightInKg * 2.20462).toFixed(1) + ' lbs';
        } else {
            return weightInKg.toFixed(1) + ' kg';
        }
    }

    // This grabs the data returned from the +page.server.ts file
    let { data } = $props();

    let topTrackTitle = data.topTrack ? data.topTrack.name : 'No top track found';
    let topTrackArtist = data.topTrack ? data.topTrack.artists.map((a: any) => a.name).join(', ') : 'Unknown artist';
    let topTrackAlbumArt = data.topTrack ? data.topTrack.album.images[0]?.url : '';
    let topTrackDurationMs = data.topTrack ? data.topTrack.duration_ms : 0;
    let topTrackDurationFormatted = formatDuration(topTrackDurationMs);
    let trackPercentage = 60
    let trackProgress = formatDuration(topTrackDurationMs * trackPercentage / 100);

    let hevyLastWorkout = data.hevyLastWorkout;
    console.log('hevyLastWorkout:', hevyLastWorkout.exercises[0].sets[0].weight_kg);
    let hevyLastWorkoutTitle = hevyLastWorkout ? hevyLastWorkout.title : 'No last workout found';
    let hevyLastWorkoutDate = hevyLastWorkout ? new Date(hevyLastWorkout.start_time).toLocaleDateString("de-DE") : 'No last workout found';
    let hevyLastWorkoutDiff = hevyLastWorkout ? getTimeAgo(hevyLastWorkout.start_time) : null;
    let hevyLastWorkoutExercises = hevyLastWorkout ? hevyLastWorkout.exercises : [];

    let isLbs = $state(true);

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
            <div class="sidebar card">
                <div class="sidebar-item"><House size={20} class="icon"/> Home</div>
                <div class="sidebar-item"><Inbox size={20} class="icon"/> Inbox</div>
                <div class="sidebar-item"><Newspaper size={20} class="icon"/> News</div>
            </div>
            <div class="mock-content">
                <div class="mock-audio-player card">
                    <img src={topTrackAlbumArt} alt="Album Art" class="mock-album-art"/>
                    <div class="mock-audio-player-info">
                        <div class="mock-audio-player-header">
                            <div class="mock-audio-player-text">
                                <p class="mock-song-title notice-text">{topTrackTitle}</p>
                                <p class="mock-song-artist back-text">{topTrackArtist}</p>
                            </div>
                            <Heart class="big-icon"/>
                            <CirclePlus class="big-icon"/>
                        </div>
                        <div class="mock-audio-player-bar">
                            <p class="back-text">{trackProgress}</p>
                            <span class="mock-audio-player-bar-progress" style:--progress="{trackPercentage}%"></span>
                            <p class="back-text">{topTrackDurationFormatted}</p>
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
                <div class="mock-content-row">
                    <div class="mock-gym-history card">
                        <div class="mock-gym-history-header">
                            <div class="two-row-text">
                                <p>Last Workout:</p>
                                <p class="notice-text">{hevyLastWorkoutTitle}</p>
                            </div>
                            <ToggleButton bind:checked={isLbs}>
                                {#snippet left()}
                                    <p class="bold">Kg</p>
                                {/snippet}
                                
                                {#snippet right()}
                                    <p class="bold">Lbs</p>
                                {/snippet}
                            </ToggleButton>
                            {#if hevyLastWorkoutDiff?.years > 0}
                                <Angry class="big-icon"/>
                            {:else if hevyLastWorkoutDiff?.months > 1}
                                <Frown class="big-icon"/>
                            {:else if hevyLastWorkoutDiff?.months === 1}
                                <Meh class="big-icon"/>
                            {:else}
                                <Smile class="big-icon"/>
                            {/if}
                            <div class="two-row-text">
                                <p>Date: {hevyLastWorkoutDate}</p>
                                <p>{hevyLastWorkoutDiff.days} day{hevyLastWorkoutDiff.days > 1 ? 's' : ''} ago</p>
                            </div>
                        </div>
                        <div class="mock-gym-history-exercises">
                            {#each hevyLastWorkoutExercises as exercise (exercise.exercise_template_id)}
                                <div class="mock-gym-history-exercise">
                                    <p class="notice-text">{exercise.title}</p>
                                    <div class="mock-gym-history-set">
                                        <p class="left-align back-text">Set</p>
                                        <p class="center-align back-text">Weight</p>
                                        <p class="center-align back-text">Reps</p>
                                        {#each exercise.sets as set, index (index)}
                                            {#if set.type === "warmup"}
                                                <p class="bold left-align">W</p>
                                            {:else}
                                                <p class="bold left-align">{exercise.sets.slice(0, index + 1).filter(s => s.type !== 'warmup').length}</p>
                                            {/if}
                                            
                                            <p class="center-align">{formatWeight(set.weight_kg, isLbs)}</p>
                                            <p class="center-align" >{set.reps}</p>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .palette-chooser-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

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

    .mock-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .mock-audio-player {
        display: grid;
        grid-template-columns: 1fr 4fr;
        align-items: center;
        justify-content: center;
        height: fit-content;
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
    }

    :global(.big-icon) {
        width: 2rem;
        height: auto;
        stroke: var(--color-secondary);
        cursor: pointer;
    }

    .mock-audio-player-bar {
        display: flex;
        align-items: center;
        justify-items: center;
        gap: 0.5rem;
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
        border: 0.2rem solid var(--color-secondary);
        border-radius: 50%;
    }

    .mock-gym-history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

        > :first-child {
            margin-right: auto;
        }
    }
    .two-row-text {
        display: flex;
        flex-direction: column;
    }

    .mock-gym-history-exercises {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .mock-gym-history-exercise {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .mock-gym-history-set {
        display: grid;
        grid-template-columns: 1fr max-content max-content;
        align-items: center;
        gap: 0.5rem;
    }

</style>