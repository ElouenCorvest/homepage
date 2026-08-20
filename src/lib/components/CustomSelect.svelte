<script lang="ts">
    import { ChevronDown } from 'lucide-svelte';

    type SelectOption = {
        id: string;
        label?: string;
        value?: string | number;
    };

    let {
        options = [],
        value = $bindable(''),
        onchange = () => {}
    } = $props();

    let isOpen = $state(false);
    let containerRef: HTMLDivElement | undefined;

    const normalizedOptions = $derived.by(() => {
        if (Array.isArray(options) && options.length > 0) {
            return options
                .filter((option) => option.id !== value)
                .map((option) => ({
                    id: String(option.id),
                    label: String(option.label ?? option.value ?? option.id),
                }));
        }
    });

    const selectedOption = $derived(
        options.find((option) => option.id === value) ?? {
            id: value,
            label: value || 'Select'
        }
    );

    function handleWindowClick(event: MouseEvent) {
        if (isOpen && containerRef && !containerRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    function handleSelect(option: SelectOption) {
        value = option.id;
        onchange(option.id);
        isOpen = false;
    }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="custom-select" bind:this={containerRef}>
    <button type="button" class="trigger" onclick={() => (isOpen = !isOpen)}>
        <span>{@html selectedOption.label}</span>
        <ChevronDown size={16} />
    </button>

    {#if isOpen}
        <ul class="dropdown">
            {#each normalizedOptions as option}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li class="option" onclick={() => handleSelect(option)}>
                    {@html option.label}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .custom-select {
        position: relative;
        width: 100%;
        max-width: 200px;
    }

    .trigger {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: var(--background-color);
        border: 1px solid var(--color-secondary);
        border-radius: 6px;
        color: var(--color-accent);
        cursor: pointer;
        text-align: left;
        font-size: 0.95rem;
    }

    .dropdown {
        position: absolute;
        max-height: 12rem;
        overflow-y: auto;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        background: var(--color-background-notice);
        border: 1px solid var(--color-primary);
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        z-index: 20;
    }
    .dropdown::-webkit-scrollbar {
        width: 8px;
    }

    .dropdown::-webkit-scrollbar-track {
        background: transparent;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background-color: var(--color-secondary);
        border-radius: 10px;
        border: 2px solid var(--color-background-notice);
    }

    .option {
        padding: 0.6rem 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
    }

    .option:last-child {
        border-bottom: none;
    }

    .option:hover {
        background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }
</style>