<script lang="ts">
  import dayjs from 'dayjs'
  import { orderBy } from 'lodash-es'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import FABSettings from '../components/buttons/FABSettings.svelte'
  import Checkbox from '../components/forms/Checkbox.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import {
    canEdit,
    fromTimestamp,
    getDocs,
    getUpcomingDishes,
    loading,
    removeShoppingList,
    saveShoppingList,
  } from '../firebase'
  import type { ShoppingItem, ShoppingList } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  const start = dayjs().startOf('day')

  const end = dayjs().add(7, 'days')

  const defaultShoppingList: ShoppingList = {
    id: null,
    uid: null,
    date: new Date(),
    name: `${start.format('MM/DD')} - ${end.format('MM/DD')}`,
    items: [],
  }

  let nameRef: HTMLInputElement

  let activeList: ShoppingList = defaultShoppingList

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let editHeaderLabel = ''

  let sortByField = 'date'

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

  $: orderedDocs = derived(docs, (d) => {
    const ordered = orderBy(d, [sortByField], [sortDirection])

    return searchCheck === ''
      ? ordered
      : ordered.filter((list) => list.name.toLowerCase().includes(searchCheck))
  })

  $: upcomingDishes = derived(getUpcomingDishes(), (d) =>
    d.map((dish) => ({ ...dish, date: fromTimestamp(dish.date) }))
  )

  $: selectedItems = [] as Array<ShoppingItem>

  function resetBottomSheet() {
    showBottomSheet = false
    activeList = { ...defaultShoppingList }
    errors = []
  }

  function onClickList(list: ShoppingList) {
    navigate(`/shopping-lists/${list.id}`)
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

  function onToggleDishItems(i: number) {
    return function (e: Event) {
      const checked = (e.target as HTMLInputElement).checked
      const dish = $upcomingDishes[i]
      const items: typeof selectedItems = []

      if (dish.type === 'PantryItem' && dish.item) {
        items.push({
          item: dish.item,
          quantity: '1',
          completed: false,
        })
      } else if (dish.type === 'Recipe' && dish.recipe) {
        dish.recipe.items.forEach((item) =>
          items.push({
            ...item,
            completed: false,
          })
        )
      }

      if (checked) {
        selectedItems = [...selectedItems, ...items]
      } else {
        selectedItems = selectedItems.filter((i) =>
          items.every(
            (i2) =>
              i.item.name !== i2.item.name &&
              i.quantity !== i2.quantity &&
              i.unit !== i2.unit
          )
        )
      }
    }
  }

  function save() {
    if (activeList.name.trim() === '') {
      errors = ['* name required']
    } else {
      saveShoppingList({
        ...activeList,
        items: selectedItems,
        date: new Date(),
      })

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
    <ListConfig
      bind:sort={sortByField}
      bind:direction={sortDirection}
      sortFields={{ date: 'Date', name: 'Name' }}
    />
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
        on:focus={() => nameRef.setSelectionRange(0, 9999)}
      />
      <h3>Add dishes to shopping list</h3>
      {#each $upcomingDishes as dish, i}
        <Checkbox on:change={onToggleDishItems(i)}>
          {#if dish.item}
            {dish.item.name}
          {:else if dish.recipe}
            {dish.recipe.name}
          {/if}
        </Checkbox>
        <br />
      {/each}
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
