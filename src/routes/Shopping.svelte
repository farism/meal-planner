<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import FabCreate from '../components/buttons/FABCreate.svelte'
  import FabRemove from '../components/buttons/FABRemove.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import FabPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { canEdit } from '../firebase'
  import type { ShoppingItem } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  let showBottomSheet = false

  let isRemoving = false

  // $: doc = getDoc<ShoppingList>('shopping_lists', '')

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function onRemoveItem(item: ShoppingItem) {
    // removeDish(dish)
  }
</script>

<div class="content">
  <Header>
    <div>Shopping List</div>
  </Header>
</div>

{#if $canEdit}
  <div class="fab-panel">
    <FabPanel>
      {#if $canEdit}
        <FabRemove on:click={onClickRemove} {isRemoving} />
        <FabCreate on:click={onClickRemove} {isRemoving} />
      {/if}
    </FabPanel>
  </div>
{/if}

<BottomSheet heading="bottom sheet" bind:open={showBottomSheet}>
  <p>bottom sheet</p>
</BottomSheet>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-36px) scale(0.9);
  }

  .content {
    transition: 0.2s transform ease-out;
  }
</style>
