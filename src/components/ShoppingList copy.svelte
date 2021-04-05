<script lang="ts">
  import { add, getDocs, remove } from '../firebase'
  import type { ShoppingList } from '../types'

  export let location = ''

  $: docs = getDocs<ShoppingList>('shopping_lists')
</script>

<div>
  <h1>Shopping Lists</h1>

  <button on:click={() => add('shopping_lists', { name: 'broccoli' })}>
    add
  </button>

  {#if $docs}
    {#each $docs as { id, uid, name }}
      <div>
        {name}
        <button on:click={() => remove('shopping_lists', id)}>-</button>
      </div>
    {/each}
  {:else}
    <div>loading</div>
  {/if}
</div>

<style>
</style>
