<script lang="ts">
    // Use $bindable so the parent page can read and change the toggle state
    let { 
        checked = $bindable(false),
        label = "" 
    } = $props();

    function handleToggle() {
        checked = !checked;
    }
</script>

<label class="toggle-wrapper">
    {#if label}
        <span class="toggle-label">{label}</span>
    {/if}
    
    <button 
        type="button" 
        role="switch" 
        aria-checked={checked}
        class="toggle-track"
        class:is-active={checked}
        onclick={handleToggle}
    >
        <span class="toggle-thumb"></span>
    </button>
</label>

<style>
    .toggle-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    .toggle-label {
        font-size: 1rem;
        color: var(--color-text);
    }

    .toggle-track {
        position: relative;
        width: 3rem;
        height: 1.5rem;
        background-color: var(--color-secondary);
        border: none;
        border-radius: 9999px;
        padding: 0;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .toggle-track.is-active {
        background-color: var(--color-secondary);
    }

    /* The sliding circle */
    .toggle-thumb {
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1.25rem;
        height: 1.25rem;
        background-color: var(--color-primary);
        border-radius: 50%;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    /* Slide the thumb to the right when active */
    .toggle-track.is-active .toggle-thumb {
        transform: translateX(1.5rem);
    }

    /* Add a nice outline when navigating with the keyboard */
    .toggle-track:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
</style>