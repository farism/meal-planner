<script lang="ts">
  import { orderBy } from 'lodash-es'
  import SlidersIcon from 'svelte-feather-icons/src/icons/SlidersIcon.svelte'
  import { derived } from 'svelte/store'
  import AddRemoveFab from '../components/buttons/AddRemoveFAB.svelte'
  import Button from '../components/buttons/Button.svelte'
  import FAB from '../components/buttons/FAB.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import Select from '../components/forms/Select.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import { add, getDocs, remove, update } from '../firebase'
  import type { PantryItem } from '../types'

  export let location = ''

  const defaultPantryItem: PantryItem = { name: '', category: '' }

  let nameRef: HTMLInputElement

  let activeItem: PantryItem | null = null

  let showListConfig = false

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let editHeaderLabel = ''

  let sortByField = 'name'

  let sortDirection: 'asc' | 'desc' = 'asc'

  $: editHeaderLabel = activeItem?.id ? 'Edit' : 'Create'

  $: editButtonLabel = activeItem?.id ? 'Update' : 'Create'

  $: docs = getDocs<PantryItem>('pantry')

  $: orderedDocs = derived(docs, ($docs) =>
    orderBy($docs, [sortByField], [sortDirection])
  )

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')

    setTimeout(() => nameRef.focus())
  } else {
    document.body.classList.remove('bottomsheet-open')

    setTimeout(resetBottomSheet, 100)
  }

  function toggleListConfig() {
    showListConfig = !showListConfig
  }

  function resetBottomSheet() {
    activeItem = null
    errors = []
  }

  function onClickAdd() {
    activeItem = { ...defaultPantryItem }
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function editPantryItem(item: PantryItem) {
    activeItem = item
    showBottomSheet = true
  }

  function addPantryItem() {
    if (activeItem) {
      if (activeItem.name.trim() === '') {
        errors = ['* name required']
      } else if (activeItem.id) {
        update<PantryItem>('pantry', activeItem)
          ?.then(() => console.log)
          .catch(() => console.error)
          .finally(() => (showBottomSheet = false))
      } else {
        add<PantryItem>('pantry', activeItem)
          ?.then(() => console.log)
          .catch(() => console.error)
          .finally(() => (showBottomSheet = false))
      }
    }
  }

  function removePantryItem(item: PantryItem) {
    if (item.id) {
      remove('pantry', item.id)
    }
  }
</script>

<div class="list" class:isRemoving>
  <div class="content">
    <Header>
      <div>Pantry</div>
    </Header>
    <List
      docs={orderedDocs}
      removing={isRemoving}
      onRemove={removePantryItem}
      onClick={editPantryItem}
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
      <div class="add-button">
        <Button on:click={addPantryItem}>{editButtonLabel} Item</Button>
      </div>
    {/if}
  </div>
</BottomSheet>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-36px) scale(0.9);
  }

  .bottom-sheet :global(input) {
    margin-bottom: 24px;
  }

  .list {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s transform ease-out;
  }

  .add-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
