<script lang="ts">
  import { savePantryItem } from '../../firebase'
  import type { PantryItem } from '../../types'
  import Button from '../buttons/Button.svelte'
  import Errors from '../forms/Errors.svelte'
  import Input from '../forms/Input.svelte'
  import Select from '../forms/Select.svelte'
  import BottomSheet from './BottomSheet.svelte'

  const defaultPantryItem: PantryItem = {
    id: null,
    uid: null,
    name: '',
    category: '',
  }

  export let open = false

  export let heading = ''

  export let button = ''

  export let activeItem: PantryItem = defaultPantryItem

  export let onDismiss = () => {}

  let nameRef: HTMLInputElement

  let errors: string[] = []

  $: if (open) {
    document.body.classList.add('bottomsheet-open')

    setTimeout(() => nameRef.focus())
  } else {
    document.body.classList.remove('bottomsheet-open')
  }

  function dismiss() {
    setTimeout(resetBottomSheet, 100)

    onDismiss()
  }

  function resetBottomSheet() {
    open = false
    activeItem = { ...defaultPantryItem }
    errors = []
  }

  function saveItem() {
    if (activeItem.name.trim() === '') {
      errors = ['* name required']
    } else {
      savePantryItem(activeItem)
      resetBottomSheet()
    }
  }
</script>

<BottomSheet {heading} onDismiss={dismiss} bind:open>
  <div class="bottom-sheet">
    {#if errors.length > 0}
      <Errors {errors} />
    {/if}
    {#if activeItem}
      <Input
        name="name"
        placeholder="name *"
        bind:ref={nameRef}
        bind:value={activeItem.name}
      />
      <Select name="category">
        <option>category</option>
        <option value="Baby">Baby</option>
        <option value="Bakery">Bakery</option>
        <option value="Beverages">Beverages</option>
        <option value="Breakfast & Cereal">Breakfast & Cereal</option>
        <option value="Canned">Canned</option>
        <option value="Condiments & Dressings">Condiments & Dressings</option>
        <option value="Cooking & Baking">Cooking & Baking</option>
        <option value="Dairy">Dairy</option>
        <option value="Deli">Deli</option>
        <option value="Frozen Foods">Frozen Foods</option>
        <option value="Pasta">Pasta</option>
        <option value="Personal Care">Personal Care</option>
        <option value="Household & Cleaning">Household & Cleaning</option>
        <option value="Meat">Meat</option>
        <option value="Pet">Pet</option>
        <option value="Produce">Produce</option>
        <option value="Seafood">Seafood</option>
        <option value="Snacks">Snacks</option>
        <option value="Soups">Soups</option>
        <option value="Wine & Beer">Wine & Beer</option>
        <option value="Other">Other</option>
      </Select>
      <div class="save-button">
        <Button on:click={saveItem}>{button}</Button>
      </div>
    {/if}
  </div>
</BottomSheet>

<style>
  .bottom-sheet :global(input) {
    margin-bottom: 24px;
  }

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
