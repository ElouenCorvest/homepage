<script>
    import { ChevronDown } from 'lucide-svelte';

    let { 
            optionsObject,
            value = $bindable(),
            onclick,
        } = $props();

    let isOpen = $state(false);
    let containerRef;

    // Close the dropdown if the user clicks outside of it
    function handleWindowClick(event) {
        if (isOpen && containerRef && !containerRef.contains(event.target)) {
        isOpen = false;
        }
    }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="custom-select" bind:this={containerRef}>
  <!-- Trigger Button -->
  <button 
    type="button" 
    class="trigger" 
    onclick={() => isOpen = !isOpen}
  >
    <span>{value}</span><ChevronDown/>
  </button>

  <!-- Dropdown Menu -->
  {#if isOpen}
    <ul class="dropdown">
      {#each Object.entries(optionsObject) as [key, value]}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li class="option" onclick={() => onclick(key)}>
          {value}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .custom-select {
    position: relative;
    width: 100%;
    max-width: 100px;
    font-family: sans-serif;
  }

  .trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--background-color);
    border: 1px solid var(--color-primary);
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
  }

  .trigger:hover {
    background: var(background-color);
  }

  .chevron {
    font-size: 0.8rem;
    transition: transform 0.2s ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    padding: 0;
    list-style: none;
    background: var(--background-color);
    border: 1px solid var(--color-primary);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 250px;
    overflow-y: auto;
    z-index: 10;
  }

  .option {
    padding: 0.5rem;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }

  .option:last-child {
    border-bottom: none;
  }

  .option:hover {
    background: #f0f7ff;
  }
</style>