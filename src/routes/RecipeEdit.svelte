<script lang="ts">
  import BottomSheet from '../components/layouts/BottomSheet.svelte'

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
  import Header from '../components/layouts/Header.svelte'
  import Modal from '../components/layouts/Modal.svelte'
  import { getDoc, getDocs, saveRecipe, savePantryItem } from '../firebase'
  import type { PantryItem, Recipe, RecipeItem } from '../types'

  export let location: string = ''

  export let navigate: NavigateFn

  export let id: string | null = null

  const defaultPantryItem: PantryItem = {
    id: null,
    uid: null,
    name: '',
    category: '',
  }

  const defaultRecipe: Recipe = {
    id: null,
    uid: null,
    name: '',
    cuisine: '',
    cookingTime: 0,
    items: [],
    steps: [],
  }

  const defaultRecipeItem: RecipeItem = {
    item: defaultPantryItem,
    quantity: '',
    unit: '',
  }

  let nameRef: HTMLInputElement

  let errors: string[] = []

  let newPantryItemErrors: string[] = []

  let newPantryItemName = ''

  let showBottomSheet = false

  $: recipe =
    id === null ? writable(defaultRecipe) : getDoc<Recipe>('recipes', id)

  $: pantry = getDocs<PantryItem>('pantry')

  function addItem() {
    if ($recipe) {
      $recipe.items = [...$recipe.items, defaultRecipeItem]
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

  function saveItem() {
    if (newPantryItemName.trim() === '') {
      newPantryItemErrors = ['* name required']
    } else {
      savePantryItem({ ...defaultPantryItem, name: newPantryItemName })
      showBottomSheet = false
      newPantryItemName = ''
    }
  }

  function checkValid(value: string) {
    return new Promise<boolean>((resolve, reject) => {
      const isInPantry = get(pantry).some((item) => item.name === value)

      if (!isInPantry) {
        newPantryItemName = value

        showBottomSheet = true
      }
    })
  }
</script>

{#if $recipe}
  <div class="content">
    <Header>
      <div>{$recipe.id ? 'Editing Recipe' : 'New Recipe'}</div>
    </Header>
    <div class="body">
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
          <option value="">cooking time</option>
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
              <Autocomplete
                placeholder="name"
                docs={pantry}
                bind:value={ingredient.item.name}
                {checkValid}
              />
            </div>
            <div class="serving">
              <div class="qty">
                <Input placeholder="qty" bind:value={ingredient.quantity} />
              </div>
              <div class="unit">
                <Select bind:value={ingredient.unit}>
                  <option value="">unit</option>
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

<BottomSheet heading="Add Pantry Item" bind:open={showBottomSheet}>
  <div class="bottom-sheet">
    {#if newPantryItemErrors.length > 0}
      <Errors errors={newPantryItemErrors} />
    {/if}
    <Input name="name" placeholder="name *" bind:value={newPantryItemName} />
    <Select name="category">
      <option>category</option>
      <option value="deli">Deli</option>
    </Select>
    <div class="save-button">
      <Button on:click={saveItem}>Add Pantry Item</Button>
    </div>
  </div>
</BottomSheet>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-50px);
  }

  .bottom-sheet :global(input) {
    margin-bottom: 24px;
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

  .errors {
    margin-top: 24px;
  }

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
