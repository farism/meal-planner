<script lang="ts">
  import { Link, Route, Router } from 'svelte-routing'
  import { add, getDocs, remove } from '../firebase'
  import type { ShoppingList } from '../types'

  export let location = ''

  $: docs = getDocs<ShoppingList>('shopping_lists')
</script>

<Router>
  <div>
    <h1>Shopping Lists</h1>

    <button on:click={() => add('shopping_lists', { name: 'broccoli' })}>
      add
    </button>

    <Link to="/shopping-list/create">create</Link>

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
  <Route path="create">
    <div>create</div>
  </Route>
</Router>

<style>
</style>
