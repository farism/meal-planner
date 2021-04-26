<script>
  import { fade } from 'svelte/transition'
  import RadioButton from '../forms/RadioButton.svelte'

  export let visible = false

  export let sort = 'category'

  export let direction = 'asc'
</script>

{#if visible}
  <div class="config" in:fade>
    <div class="scrim" on:click={() => (visible = false)} />
    <div class="menu">
      <h5>Sort By</h5>
      <RadioButton bind:group={sort} value="name">Name</RadioButton>
      <RadioButton bind:group={sort} value="category">Category</RadioButton>
      <h5>Direction</h5>
      <RadioButton bind:group={direction} value="asc">Asc</RadioButton>
      <RadioButton bind:group={direction} value="desc">Desc</RadioButton>
    </div>
  </div>
{/if}

<style>
  .config {
    background: white;
    border-radius: 4px;
    bottom: 264px;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    padding: 6px 24px;
    position: fixed;
    right: 24px;
  }

  .config :global(label + label) {
    margin: 12px 0;
  }

  .scrim {
    background: transparent;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  .menu {
    position: relative;
    z-index: 2;
  }

  h5 {
    margin: 12px 0;
  }
</style>
