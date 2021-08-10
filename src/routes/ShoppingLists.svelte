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
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import {
    canEdit,
    getDocs,
    loading,
    removeShoppingList,
    saveShoppingList,
  } from '../firebase'
  import type { ShoppingList } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  const defaultShoppingList: ShoppingList = {
    id: null,
    uid: null,
    name: '',
  }

  let nameRef: HTMLInputElement

  let activeList: ShoppingList = defaultShoppingList

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let editHeaderLabel = ''

  let sortByField = 'name'

  let sortDirection: 'asc' | 'desc' = 'asc'

  let search = ''

  $: searchCheck = search.trim().toLowerCase()

  $: noItems =
    $loading['shopping_lists'] === false
      ? 'You have not created any shopping lists'
      : ''

  $: emptyMessage = searchCheck ? 'Could not find any search results' : noItems

  $: editHeaderLabel = activeList?.id ? 'Edit' : 'Create'

  $: editButtonLabel = activeList?.id ? 'Update' : 'Create'

  $: docs = getDocs<ShoppingList>('shopping_lists')

  $: orderedDocs = derived(docs, ($docs) => {
    const ordered = orderBy($docs, [sortByField], [sortDirection])

    return searchCheck === ''
      ? ordered
      : ordered.filter((list) => list.name.toLowerCase().includes(searchCheck))
  })

  function resetBottomSheet() {
    showBottomSheet = false
    activeList = { ...defaultShoppingList }
    errors = []
  }

  function onClickList(list: ShoppingList) {
    navigate(`/shopping-list/${list.id}`)
  }

  function onClickAdd() {
    activeList = { ...defaultShoppingList }
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function setActive(list: ShoppingList) {
    activeList = list
    showBottomSheet = true
  }

  function save() {
    if (activeList.name.trim() === '') {
      errors = ['* name required']
    } else {
      saveShoppingList(activeList)
      resetBottomSheet()
    }
  }

  function remove(list: ShoppingList) {
    removeShoppingList(list)
  }
</script>

<div class="content">
  <Header>
    <div>Shopping Lists</div>
  </Header>
  <List
    {emptyMessage}
    docs={orderedDocs}
    removing={isRemoving}
    onRemove={remove}
    onClick={onClickList}
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
  heading={`${editHeaderLabel} Shopping List`}
  bind:open={showBottomSheet}
>
  <div class="bottom-sheet">
    {#if errors.length > 0}
      <Errors {errors} />
    {/if}
    {#if activeList}
      <Input
        name="name"
        placeholder="name *"
        bind:ref={nameRef}
        bind:value={activeList.name}
      />
      <div class="save-button">
        <Button on:click={save}>{editButtonLabel} Shopping List</Button>
      </div>
    {/if}
  </div>
</BottomSheet>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-50px);
  }

  .content {
    transition: 0.2s transform ease-out;
  }

  .bottom-sheet :global(input) {
    margin-bottom: 24px;
  }

  .save-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
</style>
