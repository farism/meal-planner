<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import RemoveButton from '../buttons/RemoveButton.svelte'

  interface Item {
    name: string
    id: string
  }

  export let docs: Readable<Item[]> = writable([])

  export let removing = false

  export let onRemove = (item: any) => {}

  export let onClick = (item: any) => {}
</script>

{#if $docs}
  <ul class="list" class:removing>
    {#each $docs as item (item.id)}
      <li class="item" out:fade|local>
        <RemoveButton class="item-remove" on:click={() => onRemove(item)} />
        <div class="item-name" on:click={() => onClick(item)}>
          {item.name}
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .list {
    margin: 0;
    overflow-x: hidden;
    padding: 0;
  }

  .list.removing :global(.item-remove) {
    opacity: 1;
    pointer-events: all;
    transform: scale(1) rotate(0deg);
  }

  .list.removing .item-name {
    transform: translateX(48px);
  }

  .item {
    align-items: center;
    display: flex;
    height: 48px;
    margin: 0 -100px;
    padding: 0 130px;
    position: relative;
    transition: 0.2s transform ease-out;
    border-bottom: 1px solid rgb(230, 230, 230);
  }

  .item:active {
    background: var(--item-highlight-color);
  }

  .item + .item {
    border-top: 1px solid rgb(245, 245, 245);
  }

  .item-name {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0.2s transform ease-out;
    white-space: nowrap;
  }

  .item :global(.item-remove) {
    flex: 0 0 auto;
    opacity: 0;
    position: absolute;
    pointer-events: none;
    transform: scale(0.5) rotate(-180deg);
    transition: 0.2s all ease-out;
  }
</style>
