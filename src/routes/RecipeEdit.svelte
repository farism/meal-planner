<script lang="ts">
  import { navigate } from 'svelte-navigator'
  import { get, writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import Button from '../components/buttons/Button.svelte'
  import RemoveButton from '../components/buttons/RemoveButton.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Select from '../components/forms/Select.svelte'
  import TextArea from '../components/forms/TextArea.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc, saveRecipe } from '../firebase'
  import type { Recipe } from '../types'

  export let location: string = ''

  export let id: string | null = null

  const defaultRecipe: Recipe = {
    id: null,
    uid: null,
    name: '',
    cuisine: '',
    cookingTime: 0,
    items: [],
    steps: [],
  }

  let nameRef: HTMLInputElement

  let errors: string[] = []

  $: recipe =
    id === null ? writable(defaultRecipe) : getDoc<Recipe>('recipes', id)

  function addItem() {
    if ($recipe) {
      $recipe.items = [
        ...$recipe.items,
        { item: { uid: '', id: '', name: '', category: '' } },
      ]
    }
  }

  function removeItem(index: number) {
    if ($recipe) {
      $recipe.items = $recipe.items.filter((_, i) => index !== i)
    }
  }

  function addStep() {
    if ($recipe) {
      $recipe.steps = [...$recipe.steps, '']
    }
  }

  function removeStep(index: number) {
    if ($recipe) {
      $recipe.steps = $recipe.steps.filter((_, i) => index !== i)
    }
  }

  function cancel() {
    if ($recipe) {
      navigate(`/recipes/${$recipe.id}`, { replace: true })
    }
  }

  function save() {
    if ($recipe) {
      saveRecipe(get(recipe as any))?.then((res: any) => {
        navigate(`/recipes/${res?.id || $recipe?.id}`)
      })
    }
  }
</script>

{#if $recipe}
  <div class="wrapper">
    <div class="content">
      <Header>
        <div>{$recipe.id ? 'Editing Recipe' : 'New Recipe'}</div>
      </Header>
      <div class="body">
        {#if $recipe.id}
          <Button secondary on:click={cancel}>Stop Editing</Button>
        {/if}
        {#if errors.length > 0}
          <Errors {errors} />
        {/if}

        <h4>Information</h4>
        <div class="recipe-info">
          <Input
            placeholder="name *"
            bind:ref={nameRef}
            bind:value={$recipe.name}
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
        {#each $recipe.items as ingredient, i (i)}
          <div class="ingredient" in:fade|local out:fade|local>
            <div class="ingredient-info">
              <div class="name">
                <Input placeholder="name" bind:value={ingredient.item.name} />
              </div>
              <div class="serving">
                <div class="qty">
                  <Input placeholder="qty" bind:value={ingredient.quantity} />
                </div>
                <div class="unit">
                  <Select bind:value={ingredient.unit}>
                    <option>unit</option>
                    <option value="tsp">tsp</option>
                    <option value="tsbp">tsbp</option>
                    <option value="fl oz">fl oz</option>
                    <option value="cup">cup</option>
                    <option value="pint">pint</option>
                    <option value="quart">quart</option>
                    <option value="gallon">gallon</option>
                  </Select>
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
        {#each $recipe.steps as step, i}
          <div class="step" in:fade|local out:fade|local>
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
      </div>
    </div>
  </div>
{/if}

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s transform ease-out;
  }

  .body {
    padding: 30px;
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
    flex: 1 1 50%;
  }

  .unit {
    margin-left: 4px;
    flex: 1 1 50%;
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
