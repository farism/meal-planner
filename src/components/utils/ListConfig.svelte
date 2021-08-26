<script lang="ts">
  import { fade } from 'svelte/transition'
  import RadioButton from '../forms/RadioButton.svelte'

  export let visible = false

  export let sortFields: Record<string, string> = {
    name: 'Name',
    category: 'Category',
  }

  export let sort = 'name'

  export let direction = 'asc'
</script>

<div class="config" in:fade>
  <div class="menu">
    <h5>Sort By</h5>
    {#each Object.entries(sortFields) as [key, value]}
      <RadioButton bind:group={sort} value={key}>{value}</RadioButton>
    {/each}
    <h5>Direction</h5>
    <RadioButton bind:group={direction} value="asc">Asc</RadioButton>
    <RadioButton bind:group={direction} value="desc">Desc</RadioButton>
  </div>
</div>

<style>
  .config {
    background: var(--card-color);
    border-radius: 4px;
    bottom: 100%;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    padding: 6px 24px;
    position: absolute;
    right: 0;
  }

  .config :global(label + label) {
    margin: 12px 0;
  }

  .menu {
    position: relative;
    z-index: 2;
  }

  h5 {
    margin: 12px 0;
  }
</style>
