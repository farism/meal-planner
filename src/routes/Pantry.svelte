<script lang="ts">
  import { orderBy } from 'lodash-es'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import FABSettings from '../components/buttons/FABSettings.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Search from '../components/forms/Search.svelte'
  import Select from '../components/forms/Select.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import {
    canEdit,
    getDocs,
    loading,
    removePantryItem,
    savePantryItem,
  } from '../firebase'
  import type { PantryItem } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  const defaultPantryItem: PantryItem = {
    id: null,
    uid: null,
    name: '',
    category: '',
  }

  let nameRef: HTMLInputElement

  let activeItem: PantryItem = defaultPantryItem

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let editHeaderLabel = ''

  let sortByField = 'name'

  let sortDirection: 'asc' | 'desc' = 'asc'

  let search = ''

  $: searchCheck = search.trim().toLowerCase()

  $: noItems =
    $loading['pantry'] === false ? 'There are no items in your pantry' : ''

  $: emptyMessage = searchCheck ? 'Could not find any search results' : noItems

  $: editHeaderLabel = activeItem?.id ? 'Edit' : 'Create'

  $: editButtonLabel = activeItem?.id ? 'Update' : 'Create'

  $: docs = getDocs<PantryItem>('pantry')

  $: orderedDocs = derived(docs, ($docs) => {
    const ordered = orderBy($docs, [sortByField], [sortDirection])

    return searchCheck === ''
      ? ordered
      : ordered.filter((item) => item.name.toLowerCase().includes(searchCheck))
  })

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')

    setTimeout(() => nameRef.focus())
  } else {
    document.body.classList.remove('bottomsheet-open')

    setTimeout(resetBottomSheet, 100)
  }

  function resetBottomSheet() {
    showBottomSheet = false
    activeItem = { ...defaultPantryItem }
    errors = []
  }

  function onClickAdd() {
    activeItem = { ...defaultPantryItem }
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function setActive(item: PantryItem) {
    activeItem = item
    showBottomSheet = true
  }

  function saveItem() {
    if (activeItem.name.trim() === '') {
      errors = ['* name required']
    } else {
      savePantryItem(activeItem)
      resetBottomSheet()
    }
  }

  function removeItem(item: PantryItem) {
    removePantryItem(item)
  }
</script>

<div class="content">
  <Header>
    <div>Pantry</div>
  </Header>
  <Search bind:value={search} />
  <List
    {emptyMessage}
    docs={orderedDocs}
    removing={isRemoving}
    onRemove={removeItem}
    onClick={setActive}
  />
</div>

<FABPanel>
  <FABSettings>
    <ListConfig bind:sort={sortByField} bind:direction={sortDirection} />
  </FABSettings>
  {#if $canEdit}
    <FABRemove on:click={onClickRemove} {isRemoving} />
    <FABCreate on:click={onClickAdd} />
  {/if}
</FABPanel>

<BottomSheet
  heading={`${editHeaderLabel} Pantry Item`}
  open={showBottomSheet}
  onClickDismiss={() => (showBottomSheet = false)}
>
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
        <option value="deli">Deli</option>
      </Select>
      <div class="save-button">
        <Button on:click={saveItem}>{editButtonLabel} Item</Button>
      </div>
    {/if}
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

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
