<script lang="ts">
  import { fade } from 'svelte/transition'
  import Button from '../components/buttons/Button.svelte'
  import RemoveButton from '../components/buttons/RemoveButton.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Select from '../components/forms/Select.svelte'
  import TextArea from '../components/forms/TextArea.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { db, getDoc, getDocsFromCache } from '../firebase'
  import type { PantryItem, Recipe } from '../types'

  export let location: string = ''

  export let id: string | null = null

  const defaultRecipe: Recipe = {
    name: '',
    cuisine: '',
    cookingTime: 0,
    items: [],
    steps: [],
  }

  let nameRef: HTMLInputElement

  let errors: string[] = []

  $: doc = id ? getDoc<Recipe>('recipes', id) : null

  let recipe = doc ? $doc : defaultRecipe

  $: console.log(recipe)

  function addItem() {
    if (recipe) {
      recipe.items = [...recipe.items, { item: { name: '' } }]
    }
  }

  function removeItem(index: number) {
    if (recipe) {
      recipe.items = recipe.items.filter((_, i) => index !== i)
    }
  }

  function addStep() {
    if (recipe) {
      recipe.steps = [...recipe.steps, '']
    }
  }

  function removeStep(index: number) {
    if (recipe) {
      recipe.steps = recipe.steps.filter((_, i) => index !== i)
    }
  }

  function save() {
    if (recipe) {
    }
  }
</script>

<div class="wrapper">
  <div class="content">
    <Header>
      <div>Recipes</div>
    </Header>
    {#if errors.length > 0}
      <Errors {errors} />
    {/if}
    {#if recipe}
      <h4>Information</h4>
      <div class="recipe-info">
        <Input
          placeholder="name *"
          bind:ref={nameRef}
          bind:value={recipe.name}
        />
        <Select>
          <option>cuisine</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
        </Select>
        <Select>
          <option>cooking time</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="60">60</option>
          <option value="75">75</option>
          <option value="90">90</option>
          <option value="90+">90+</option>
        </Select>
        <h4>Ingredients</h4>
      </div>
      {#each recipe.items as ingredient, i}
        <div class="ingredient" in:fade out:fade>
          <div class="ingredient-info">
            <div class="name">
              <Input placeholder="name" bind:value={ingredient.item.name} />
            </div>
            <div class="serving">
              <div class="qty">
                <Input placeholder="qty" bind:value={ingredient.quantity} />
              </div>
              <div class="unit">
                <Input placeholder="unit" bind:value={ingredient.unit} />
              </div>
            </div>
          </div>
          <div class="remove">
            <RemoveButton on:click={() => removeItem(i)} />
          </div>
        </div>
        <div class="divider" />
      {/each}
      <Button secondary on:click={addItem}>+ Add Ingredient</Button>
      <h4>Steps</h4>
      {#each recipe.steps as step, i}
        <div class="step" in:fade out:fade>
          <h5>Step {i + 1}</h5>
          <div class="step-container">
            <TextArea bind:value={step} />
            <div class="remove">
              <RemoveButton on:click={() => removeStep(i)} />
            </div>
          </div>
        </div>
      {/each}
      <Button secondary on:click={addStep}>+ Add Step</Button>
      <div class="save-button">
        <Button on:click={save}>Save Recipe</Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s transform ease-out;
  }

  .recipe-info :global(input),
  .recipe-info :global(select) {
    margin-bottom: 24px;
  }

  .name {
    display: flex;
    flex: 1 1 auto;
  }

  .divider {
    background: var(--secondary-color-light);
    height: 1px;
    margin-bottom: 16px;
  }

  .ingredient {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .ingredient-info {
    flex: 1 1 auto;
  }

  .serving {
    display: flex;
    margin-top: 8px;
  }

  .qty {
    margin-right: 4px;
    flex: 1 1 auto;
  }

  .unit {
    margin-left: 4px;
    flex: 1 1 auto;
  }

  .step {
    margin-bottom: 24px;
  }

  .step-container {
    align-items: center;
    display: flex;
  }

  .step h5 {
    margin: 6px 0;
  }

  .remove {
    flex: 0 0 auto;
    margin-left: 16px;
  }

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
