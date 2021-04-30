<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import FABEdit from '../components/buttons/FABEdit.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc } from '../firebase'
  import type { Recipe } from '../types'

  export let location: string = ''

  export let navigate: NavigateFn

  export let fullview: boolean = true

  export let id: string | null = null

  $: recipe = getDoc<Recipe>('recipes', id)

  function editRecipe() {
    if ($recipe) {
      navigate(`/recipes/${$recipe.id}/edit`)
    }
  }
</script>

{#if $recipe}
  {#if fullview}
    <Header>
      <div>{$recipe.name}</div>
    </Header>
  {/if}

  <div class="body">
    <h4>Information</h4>
    <p>Cuisine: {$recipe.cuisine}</p>
    <p>Cooking Time: {$recipe.cookingTime} minutes</p>
    <h4>Ingredients</h4>
    <ul>
      {#each $recipe.items as ingredient, i}
        <li>
          {ingredient.quantity}
          {ingredient.unit}
          {ingredient.item.name}
        </li>
      {/each}
    </ul>
    <h4>Steps</h4>
    <ul>
      {#each $recipe.steps as step, i}
        <li>
          {step}
        </li>
      {/each}
    </ul>
  </div>

  {#if fullview}
    <FABPanel>
      <FABEdit on:click={editRecipe} />
    </FABPanel>
  {/if}
{/if}

<style>
  .body {
    padding: 0 30px 30px 30px;
  }
</style>
