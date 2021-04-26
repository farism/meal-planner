<script lang="ts" context="module">
  function isRecipe(dish: Dish) {
    return dish.type === 'Recipe'
  }

  export function getName(dish: Dish) {
    if (isRecipe(dish)) {
      return dish.recipe?.name
    } else {
      return dish.item?.name
    }
  }
</script>

<script lang="ts">
  import { readable } from 'svelte/store'
  import type { Dish } from '../../types'
  import List from './List.svelte'
  import ChevronRightIcon from 'svelte-feather-icons/src/icons/ChevronRightIcon.svelte'

  export let docs = readable<Dish[]>([], () => {})

  export let emptyMessage = ''

  export let isRemoving = false

  export let onClick = (dish: Dish) => {}

  export let onRemove = (dish: Dish) => {}
</script>

<List
  {docs}
  {getName}
  {onRemove}
  {onClick}
  {isRemoving}
  {emptyMessage}
  let:item
>
  <div class="dish-item">
    <div class="dish-name">
      {getName(item)}
    </div>
    {#if isRecipe(item)}
      <div class="dish-view">
        <ChevronRightIcon size="20" />
      </div>
    {/if}
  </div>
</List>

<style>
  .dish-item {
    display: flex;
    flex: 1 1 auto;
  }

  .dish-name {
    flex: 1 1 auto;
  }

  .dish-view {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
  }
</style>
