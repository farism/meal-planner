<script lang="ts">
  import { orderBy } from 'lodash-es'
  import SlidersIcon from 'svelte-feather-icons/src/icons/SlidersIcon.svelte'
  import { derived } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import AddRemoveFab from '../components/buttons/AddRemoveFAB.svelte'
  import Button from '../components/buttons/Button.svelte'
  import FAB from '../components/buttons/FAB.svelte'
  import RemoveButton from '../components/buttons/RemoveButton.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Select from '../components/forms/Select.svelte'
  import TextArea from '../components/forms/TextArea.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import { add, getDocs, getDocsFromCache, remove, update } from '../firebase'
  import type { PantryItem, Recipe } from '../types'

  export let location = ''

  const defaultRecipe: Recipe = {
    name: '',
    cuisine: '',
    cookingTime: 0,
    items: [],
    steps: [],
  }

  let nameRef: HTMLInputElement

  let recipe: Recipe | null = null

  let showListConfig = false

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let editHeading = ''

  let sortByField = 'name'

  let sortDirection: 'asc' | 'desc' = 'asc'

  $: editHeading = recipe?.id ? 'Edit Recipe' : 'Create Recipe'

  $: editButtonText = recipe?.id ? 'Update Recipe' : 'Create Recipe'

  $: items = getDocsFromCache<PantryItem>('pantry')

  $: docs = getDocs<Recipe>('recipes')

  $: orderedDocs = derived(docs, ($docs) =>
    orderBy($docs, [sortByField], [sortDirection])
  )

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')

    setTimeout(() => {
      console.log(nameRef)
      nameRef.focus()
    })
  } else {
    document.body.classList.remove('bottomsheet-open')

    setTimeout(resetBottomSheet, 100)
  }

  function toggleListConfig() {
    showListConfig = !showListConfig
  }

  function resetBottomSheet() {
    recipe = null
    errors = []
  }

  function onClickAdd() {
    recipe = { ...defaultRecipe }
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function editRecipe(r: Recipe) {
    recipe = r
    showBottomSheet = true
  }

  function addRecipe() {
    if (recipe) {
      if (recipe.name.trim() === '') {
        errors = ['* name required']
      } else if (recipe.id) {
        update<Recipe>('recipes', recipe)
          ?.then(() => console.log)
          .catch(() => console.error)
          .finally(() => (showBottomSheet = false))
      } else {
        add<Recipe>('recipes', recipe)
          ?.then(() => console.log)
          .catch(() => console.error)
          .finally(() => (showBottomSheet = false))
      }
    }
  }

  function removeRecipe(recipe: Recipe) {
    if (recipe.id) {
      remove('recipes', recipe.id)
    }
  }

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
</script>

<div class="list" class:isRemoving>
  <div class="content">
    <Header>
      <div>Recipes</div>
    </Header>
    <List
      docs={orderedDocs}
      removing={isRemoving}
      onRemove={removeRecipe}
      onClick={editRecipe}
    />
  </div>
</div>

<ListConfig
  bind:visible={showListConfig}
  bind:sort={sortByField}
  bind:direction={sortDirection}
/>

<FAB color="secondary" offset={{ x: 0, y: -130 }} on:click={toggleListConfig}>
  <SlidersIcon size="24" />
</FAB>

<AddRemoveFab {onClickAdd} {onClickRemove} {isRemoving} />

<BottomSheet
  heading={editHeading}
  open={showBottomSheet}
  onClickDismiss={() => (showBottomSheet = false)}
>
  {#if errors.length > 0}
    <Errors {errors} />
  {/if}
  {#if recipe}
    <h4>Information</h4>
    <div class="recipe-info">
      <Input placeholder="name *" bind:ref={nameRef} bind:value={recipe.name} />
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
    <div class="add-button">
      <Button on:click={addRecipe}>{editButtonText}</Button>
    </div>
  {/if}
</BottomSheet>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-36px) scale(0.9);
  }

  .list {
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

  .add-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
