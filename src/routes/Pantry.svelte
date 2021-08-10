<script lang="ts">
  import { orderBy } from 'lodash-es'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived } from 'svelte/store'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import FABSettings from '../components/buttons/FABSettings.svelte'
  import Search from '../components/forms/Search.svelte'
  import CreatePantryItem from '../components/layouts/CreatePantryItem.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import { canEdit, getDocs, loading, removePantryItem } from '../firebase'
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

  function removeItem(item: PantryItem) {
    removePantryItem(item)
  }
</script>

<div class="content">
  <Header heading="Pantry" />
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

<CreatePantryItem
  heading={`${editHeaderLabel} Pantry Item`}
  button={`${editButtonLabel} Item`}
  bind:open={showBottomSheet}
  {activeItem}
/>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-50px);
  }

  .content {
    transition: 0.2s transform ease-out;
  }
</style>
