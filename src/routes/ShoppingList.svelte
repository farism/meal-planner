<script lang="ts">
  import { orderBy } from 'lodash-es'
  import Select from '../components/forms/Select.svelte'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived, get, writable } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import Errors from '../components/forms/Errors.svelte'
  import Input from '../components/forms/Input.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import { canEdit, getDoc, saveShoppingList, settings } from '../firebase'
  import type { ShoppingItem, ShoppingList } from '../types'

  function defaultItem() {
    return {
      completed: false,
      item: {
        category: '',
        id: '',
        name: '',
        uid: '',
      },
      quantity: '1',
      unit: '',
    }
  }

  export let location: string = ''

  export let navigate: NavigateFn

  export let id: string | null = null

  let hideCompleted = writable(false)

  let showBottomSheet = false

  let isRemoving = false

  let errors: string[] = []

  let nameRef: HTMLInputElement

  let newItem: ShoppingItem = defaultItem()

  $: list = getDoc<ShoppingList>('shopping_lists', id)

  $: docs = derived([settings, list], ([settings, list]) =>
    orderBy(list?.items || [], ['item.name']).filter(
      (item) =>
        !settings.hideCompleted || (settings.hideCompleted && !item.completed)
    )
  )

  $: if (!showBottomSheet) {
    resetBottomSheet()
  }

  function resetBottomSheet() {
    showBottomSheet = false
    newItem = defaultItem()
    errors = []
  }

  function onClickAdd() {
    showBottomSheet = true
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function onClickItem(item: ShoppingItem) {
    const l = get(list)

    if (l) {
      saveShoppingList({
        ...l,
        items: l.items.map((i) => {
          return {
            ...i,
            completed:
              i.item.name === item.item.name ? !i.completed : i.completed,
          }
        }),
      })
    }
  }

  function onRemove(item: ShoppingItem) {
    const l = get(list)

    if (l) {
      saveShoppingList({
        ...l,
        items: l.items.filter((i) => i.item.name !== item.item.name),
      })

      newItem.item.name = ''
    }
  }

  function onAdd(e: MouseEvent) {
    if (!newItem.item.name) {
      errors = ['Name required']
      return
    }

    errors = []

    const l = get(list)

    if (l) {
      saveShoppingList({
        ...l,
        items: [...l.items, newItem],
      })

      newItem.item.name = ''
    }

    resetBottomSheet()
  }
</script>

{#if $list}
  <div class="content">
    <Header heading={$list.name} dynamicSize />
    <List
      {docs}
      getName={(item) => item.item.name}
      getKey={(item) => item.item.name}
      removing={isRemoving}
      {onRemove}
      onClick={onClickItem}
      let:item
    >
      <div class="item" class:completed={item.completed}>
        {item.item.name} - {item.quantity}
        {#if item.unit}{item.unit}(s){/if}
      </div>
    </List>
  </div>

  <FABPanel>
    {#if $canEdit}
      <FABRemove on:click={onClickRemove} {isRemoving} />
      <FABCreate on:click={onClickAdd} />
    {/if}
  </FABPanel>

  <BottomSheet heading={`Add Shopping Item`} bind:open={showBottomSheet}>
    <div class="bottom-sheet">
      {#if errors.length > 0}
        <Errors {errors} />
      {/if}
      <Input
        name="name"
        placeholder="name *"
        bind:ref={nameRef}
        bind:value={newItem.item.name}
      />
      <div class="serving">
        <div class="quantity">
          <Input placeholder="qty" bind:value={newItem.quantity} />
        </div>
        <div class="unit">
          <Select bind:value={newItem.unit}>
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
      <div class="save-button">
        <Button on:click={onAdd}>Add Item</Button>
      </div>
    </div>
  </BottomSheet>
{/if}

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-50px);
  }

  .content {
    transition: 0.2s transform ease-out;
  }

  .item::before,
  .item::after {
    content: '\00a0\00a0';
  }

  .item.completed {
    color: rgb(100, 100, 100);
    text-decoration: line-through;
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
