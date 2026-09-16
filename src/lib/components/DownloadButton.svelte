<script lang="ts">
    import { Download } from 'lucide-svelte';

    let { 
        onclick = () => {},
        ...restProps
    }: { 
        onclick?: () => void;
    } = $props();
</script>

<button class="download-btn" onclick={onclick} {...restProps}>
    <Download size={16}/><span>Download</span>
</button>

<style>
    .download-btn {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 0.3rem;
    }
</style>