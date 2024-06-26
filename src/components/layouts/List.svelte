<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import RemoveButton from '../buttons/RemoveButton.svelte'

  export let docs: Readable<any[]> = writable([])

  export let removing = false

  export let emptyMessage = 'No items to display'

  export let getKey = (item: any) => item.id

  export let getName = (item: any) => item.name

  export let onRemove = (item: any) => {}

  export let onClick = (item: any) => {}

  const hasDefaultSlot = Boolean($$props?.$$slots?.default)
</script>

<div>
  {#if $docs}
    {#if $docs.length > 0}
      <ul class="list" class:removing>
        {#each $docs as item (getKey(item))}
          <li class="item" out:fade|local={{ duration: removing ? 200 : 0 }}>
            <RemoveButton class="item-remove" on:click={() => onRemove(item)} />
            <div class="item-name" on:click={() => !removing && onClick(item)}>
              {#if hasDefaultSlot}
                <slot {item} />
              {:else}
                <div>
                  {getName(item)}
                </div>
              {/if}
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
    overflow: hidden;
    padding: 0 30px;
    position: relative;
    transition: 0.2s transform ease-out;
  }

  .item + .item {
    border-top: 1px solid var(--secondary-color-light);
  }

  .item:active {
    background: var(--item-highlight-color);
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
