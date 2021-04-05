<script lang="ts">
  import { Link } from 'svelte-routing'
  import { add, getDocs, remove } from '../firebase'
  import type { Ingredient } from '../types'

  export let location = ''

  $: docs = getDocs<Ingredient>('ingredients')
</script>

<div>
  <h1>Ingredients</h1>

  <button on:click={() => add('ingredients', { name: 'broccoli' })}>add</button>

  {#if $docs}
    {#each $docs as { id, uid, name }}
      <div>
        <Link to={`/ingredients/${id}`}>
          {name}
        </Link>
        <button on:click={() => remove('ingredients', id)}>-</button>
      </div>
    {/each}
  {:else}
    <div>loading</div>
  {/if}
</div>

<style>
</style>
