<script lang="ts">
    import logoSvg from '$lib/assets/logo.svg?raw';
</script>

<div class="content">
    <div class="logo">
        {@html logoSvg}
    </div>

    <h1>Welcome to My Website!</h1>
    <p>Here you will be able to find everything I deem important to showcase my self to the public. Everything that is tied to me, Elouen Corvest, will be displayed here.</p>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        text-align: center;
    }

    .logo :global(path) {
        /* Change the fill color */
        fill: var(--color-primary) !important;
        stroke: none !important;
    }

    .logo :global(svg) {
        width: 40rem;
        height: auto;
    }

    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

</style>
