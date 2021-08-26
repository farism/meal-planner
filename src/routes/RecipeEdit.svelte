<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import { get, writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import Button from '../components/buttons/Button.svelte'
  import RemoveButton from '../components/buttons/RemoveButton.svelte'
  import Autocomplete from '../components/forms/Autocomplete.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Select from '../components/forms/Select.svelte'
  import TextArea from '../components/forms/TextArea.svelte'
  import CreatePantryItem from '../components/layouts/CreatePantryItem.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc, getDocs, saveRecipe } from '../firebase'
  import type { PantryItem, Recipe, RecipeItem } from '../types'

  export let location: string = ''

  export let navigate: NavigateFn

  export let id: string | null = null

  function defaultPantryItem(): PantryItem {
    return {
      id: null,
      uid: null,
      name: '',
      category: '',
    }
  }

  function defaultRecipe(): Recipe {
    return {
      id: null,
      uid: null,
      name: '',
      cuisine: '',
      cookingTime: '',
      items: [defaultRecipeItem()],
      steps: [''],
    }
  }

  function defaultRecipeItem(): RecipeItem {
    return {
      item: defaultPantryItem(),
      quantity: '',
      unit: '',
    }
  }

  let nameRef: HTMLInputElement

  let errors: string[] = []

  let showBottomSheet = false

  let activeRecipeItemIndex = -1

  $: recipe =
    id === null ? writable(defaultRecipe()) : getDoc<Recipe>('recipes', id)

  $: pantry = getDocs<PantryItem>('pantry')

  $: activeRecipeItem = $recipe?.items.find(
    (item, i) => i === activeRecipeItemIndex
  )

  function addItem() {
    if ($recipe) {
      $recipe.items = [...$recipe.items, defaultRecipeItem()]
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
      const items = $recipe.items

      if (items.length > 0 && items.every((i) => i.item.name === '')) {
        errors = ['* ingredient names required']
      } else {
        saveRecipe(get(recipe as any))?.then((res: any) => {
          navigate(`/recipes/${res?.id || $recipe?.id}`)
        })
      }
    }
  }

  function checkValid(value: string) {
    return new Promise<boolean>((resolve, reject) => {
      const isInPantry = get(pantry).some((item) => item.name === value)

      if (!isInPantry) {
        showBottomSheet = true
      }
    })
  }

  function resetPantryItem() {
    const r = get(recipe)

    if (r) {
      r.items = r.items.map((item, i) =>
        i === activeRecipeItemIndex
          ? { ...item, item: defaultPantryItem() }
          : item
      )

      recipe.set(r)
    }
  }
</script>

{#if $recipe}
  <div class="content">
    <Header heading={$recipe.id ? 'Editing Recipe' : 'New Recipe'} />
    <div class="body">
      <h4>Information</h4>
      <div class="recipe-info">
        <Input
          placeholder="name *"
          bind:ref={nameRef}
          bind:value={$recipe.name}
        />
        <Select bind:value={$recipe.cuisine}>
          <option value="" disabled>cuisine</option>
          <option value="American">American</option>
          <option value="Chinese">Chinese</option>
          <option value="French">French</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Mexican">Mexican</option>
        </Select>
        <Select bind:value={$recipe.cookingTime}>
          <option value="" disabled>cooking time</option>
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
      {#each $recipe.items as item, i (i)}
        <div class="item" in:fade|local out:fade|local>
          <div class="item-info">
            <div class="name">
              <Autocomplete
                bind:value={item.item.name}
                on:focus={() => (activeRecipeItemIndex = i)}
                placeholder="name"
                docs={pantry}
                {checkValid}
              />
            </div>
            <div class="serving">
              <div class="quantity">
                <Input placeholder="qty" bind:value={item.quantity} />
              </div>
              <div class="unit">
                <Select bind:value={item.unit}>
                  <option value="" disabled>unit</option>
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
      <div class="errors">
        {#if errors.length > 0}
          <Errors {errors} />
        {/if}
      </div>
      {#if $recipe.id}
        <Button warning on:click={cancel}>Cancel</Button>
      {/if}
      <div class="save-button">
        <Button on:click={save}>Save Recipe</Button>
      </div>
    </div>
  </div>
{/if}

{#if activeRecipeItem}
  <CreatePantryItem
    bind:open={showBottomSheet}
    activeItem={activeRecipeItem.item}
    heading="Add Pantry Item"
    button="Add Pantry Item"
    onDismiss={resetPantryItem}
  />
{/if}

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-50px);
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

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .item-info {
    flex: 1 1 auto;
  }

  .serving {
    display: flex;
    margin-top: 8px;
  }

  .quantity {
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

  .errors {
    margin-top: 24px;
  }

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  option[value='']:disabled {
    display: none;
  }
</style>
