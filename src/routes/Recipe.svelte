<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import FABEdit from '../components/buttons/FABEdit.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc } from '../firebase'
  import type { Recipe } from '../types'

  export let location: string = ''

  export let navigate: NavigateFn

  export let id: string | null = null

  $: recipe = getDoc<Recipe>('recipes', id)

  $: console.log($recipe)

  function editRecipe() {
    if ($recipe) {
      navigate(`/recipes/${$recipe.id}/edit`)
    }
  }

  function fontSize(str: string) {
    if (str.length < 15) {
      return 'lg'
    } else if (str.length < 25) {
      return 'md'
    } else {
      return 'sm'
    }
  }
</script>

{#if $recipe}
  <div class="header {fontSize($recipe.name)}">
    <Header heading={$recipe.name} dynamicSize />
  </div>

  <div class="body">
    <h4>Cuisine</h4>
    <p>{$recipe.cuisine}</p>
    <h4>Cooking Time</h4>
    <p>{$recipe.cookingTime} minutes</p>
    <h4>Ingredients</h4>
    <ul class="ingredients">
      {#each $recipe.items as ingredient, i}
        <li>
          {ingredient.item.name} -
          {ingredient.quantity}
          {ingredient.unit}{#if ingredient.unit}(s){/if}
        </li>
      {/each}
    </ul>
    <h4>Directions</h4>
    <ul class="directions">
      {#each $recipe.steps as step, i}
        <li>
          <div>Step {i + 1}</div>
          <p>{step}</p>
        </li>
      {/each}
    </ul>
  </div>

  <FABPanel>
    <FABEdit on:click={editRecipe} />
  </FABPanel>
{/if}

<style>
  .body {
    padding: 0 30px 30px 30px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 32px;
  }

  .header.lg :global(h1) {
    font-size: 2em;
  }

  .header.md :global(h1) {
    font-size: 1.5em;
  }

  .header.sm :global(h1) {
    font-size: 1em;
  }
</style>
