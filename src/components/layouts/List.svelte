<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import RemoveButton from '../buttons/RemoveButton.svelte'

  export let docs: Readable<any[]> = writable([])

  export let removing = false

  export let emptyMessage = 'No items to display'

  export let keyField = 'id'

  export let getName = (item: any) => item.name

  export let onRemove = (item: any) => {}

  export let onClick = (item: any) => {}
</script>

<div class="wrapper">
  {#if $docs}
    {#if $docs.length > 0}
      <ul class="list" class:removing>
        {#each $docs as item (item[keyField])}
          <li class="item" out:fade|local>
            <RemoveButton class="item-remove" on:click={() => onRemove(item)} />
            <div class="item-name" on:click={() => onClick(item)}>
              <div>
                {getName(item)}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {:else if emptyMessage}
      <p>{emptyMessage}</p>
    {/if}
  {/if}
</div>

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .list {
    margin: 0;
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
    padding: 0 30px;
    position: relative;
    transition: 0.2s transform ease-out;
    border-bottom: 1px solid rgb(215, 215, 215);
  }

  .item:active {
    background: var(--item-highlight-color);
  }

  .item + .item {
    border-top: 1px solid rgb(235, 235, 235);
  }

  .item-name {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
    transition: 0.2s transform ease-out;
  }

  .item-name div {
    overflow: hidden;
    text-overflow: ellipsis;
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

  p {
    font-style: italic;
    margin: 0;
    padding: 30px;
    text-align: center;
  }
</style>
