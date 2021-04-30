<script lang="ts">
  import SlidersIcon from 'svelte-feather-icons/src/icons/SlidersIcon.svelte'
  import FAB from './FAB.svelte'

  let visible = false
</script>

<FAB color="secondary" on:click={() => (visible = !visible)}>
  <SlidersIcon size="24" />
</FAB>

{#if visible}
  <div class="scrim" on:click={() => (visible = false)} />
  <slot />
{/if}

<style>
  .scrim {
    background: transparent;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
  }
</style>
