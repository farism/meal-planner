<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import FABEdit from '../components/buttons/FABEdit.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { getDoc, getShoppingItems } from '../firebase'
  import type { Recipe, ShoppingList } from '../types'
  import ShoppingLists from './ShoppingLists.svelte'

  export let location: string = ''

  export let navigate: NavigateFn

  export let id: string | null = null

  $: list = getDoc<ShoppingList>('shopping_lists', id)

  $: items = getShoppingItems($list)

  $: console.log($items)
</script>

{#if $list}
  <Header heading={$list.name} dynamicSize />

  <div class="body" />

  <!-- <FABPanel>
    <FABEdit on:click={editRecipe} />
  </FABPanel> -->
{/if}

<style>
  .body {
    padding: 0 30px 30px 30px;
  }
</style>
