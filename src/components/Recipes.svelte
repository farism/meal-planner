<script lang="ts">
  import { Link } from 'svelte-routing'
  import { add, getDocs, remove } from '../firebase'
  import type { Recipe } from '../types'

  export let location = ''

  $: docs = getDocs<Recipe>('recipes')
</script>

<h1>Recipes</h1>

<button on:click={() => add('recipes', { name: 'recipe 1' })}>add</button>

{#if $docs}
  {#each $docs as { id, uid, name }}
    <div>
      <Link to={`/recipes/${id}`}>
        {name}
      </Link>
      <button on:click={() => remove('recipes', id)}>-</button>
    </div>
  {/each}
{:else}
  <div>loading</div>
{/if}

<style>
</style>
