<script lang="ts">
  export let tabs: string[]

  export let onClickTab = (i: number) => {}

  export let active = 0
</script>

<div class="tabs">
  {#each tabs as tab, i}
    <button
      class:active={active === i}
      on:click={() => {
        active = i
        onClickTab(i)
      }}
    >
      {tab}
    </button>
  {/each}
</div>

<style>
  .tabs {
    border-bottom: 1px solid var(--secondary-color-light);
    display: flex;
  }

  .tabs button {
    background: var(--secondary-color-light2);
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    flex: 1 1 auto;
    font-size: 18px;
    margin: 0;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    outline: 0;
  }

  .tabs button.active {
    background: white;
    border-bottom-color: var(--primary-color);
  }
</style>
