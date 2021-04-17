<script lang="ts">
  import ShareIcon from 'svelte-feather-icons/src/icons/ShareIcon.svelte'
  import FAB from '../components/buttons/FAB.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc } from '../firebase'
  import type { ShoppingList } from '../types'

  export let location = ''

  let showBottomSheet = false

  let isRemoving = false

  $: doc = getDoc<ShoppingList>('shopping_lists', '')

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')
  }
</script>

<div class="list" class:isRemoving>
  <div class="content">
    <Header>
      <div>Shopping List</div>
    </Header>
    <!-- <List
      docs={orderedDocs}
      removing={isRemoving}
      onRemove={removeRecipe}
      onClick={editRecipe}
    /> -->
  </div>
</div>

<FAB color="secondary">
  <ShareIcon size="24" />
</FAB>

<BottomSheet
  heading="bottom sheet"
  open={showBottomSheet}
  onClickDismiss={() => (showBottomSheet = false)}
>
  <p>bottom sheet</p>
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
</style>
