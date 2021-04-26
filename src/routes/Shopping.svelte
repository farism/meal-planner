<script lang="ts">
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Header from '../components/layouts/Header.svelte'

  export let location = ''

  let showBottomSheet = false

  let isRemoving = false

  // $: doc = getDoc<ShoppingList>('shopping_lists', '')

  $: if (showBottomSheet) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')
  }
</script>

<div class="content">
  <Header>
    <div>Shopping List</div>
  </Header>
</div>

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

  .content {
    transition: 0.2s transform ease-out;
  }
</style>
