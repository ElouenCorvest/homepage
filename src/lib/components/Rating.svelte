<script lang="ts">
    let {
        score = 0,
        maxScore = 5,
        size = "16px",
    } : {
        score?: number;
        maxScore?: number;
        size?: string;
        color?: string;
    } = $props();
</script>

<div class="rating-container" aria-label="{score} out of {maxScore}">
    {#each { length: maxScore } as _, i}
        <div
            class="circle"
            class:filled={i < score}
            style="width: {size}; height: {size};"
            aria-hidden="true"
        ></div>
        
    {/each}
</div>

<style>
    .rating-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .circle {
        border-radius: 50%;
        background-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
        box-sizing: border-box;
    }

    .circle.filled {
        background-color: var(--color-primary);
    }
</style>
