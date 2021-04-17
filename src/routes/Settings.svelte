<script lang="ts">
  import Header from '../components/layouts/Header.svelte'
  import { add, getDocs, remove } from '../firebase'
  import type { PantryItem } from '../types'

  export let location = ''

  const defaultPantryItem: PantryItem = { name: '', category: '' }

  let activeItem: PantryItem | null = null

  let showBottomSheet = false

  let showItemRemove = false

  $: docs = getDocs<PantryItem>('pantry')

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')

    setTimeout(() => (activeItem = null), 300)
  }

  function onClickRemoveFAB() {
    showItemRemove = !showItemRemove
  }

  function onClickCreateFAB() {
    activeItem = { ...defaultPantryItem }
    showBottomSheet = true
  }

  function editPantryItem(item: PantryItem) {
    activeItem = item
    showBottomSheet = true
  }

  function addPantryItem() {
    if (activeItem) {
      add<PantryItem>('pantry', activeItem)
        ?.then(() => console.log)
        .catch(() => console.error)
        .finally(() => (showBottomSheet = false))
    }
  }

  function removePantryItem(item: PantryItem) {
    if (item.id) {
      remove('pantry', item.id)
    }
  }
</script>

<div class="wrapper">
  <div class="content">
    <Header>
      <div>Settings</div>
    </Header>
    <p>Settings</p>
  </div>
</div>

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s all ease-out;
  }
</style>
