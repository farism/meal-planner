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
  import ChevronRightIcon from 'svelte-feather-icons/src/icons/ChevronRightIcon.svelte'
  import { readable } from 'svelte/store'
  import type { Dish } from '../../types'
  import List from './List.svelte'

  export let docs = readable<Dish[]>([], () => {})

  export let emptyMessage = ''

  export let removing = false

  export let onClick = (dish: Dish) => {}

  export let onRemove = (dish: Dish) => {}
</script>

<div class="dish-list">
  <List
    {docs}
    {getName}
    {onRemove}
    {onClick}
    {removing}
    {emptyMessage}
    let:item
  >
    <div class="dish-item">
      <div class="dish-name">
        {getName(item)}
      </div>
      {#if isRecipe(item)}
        <div class="recipe-indicator">
          <ChevronRightIcon size="20" />
        </div>
      {/if}
    </div>
  </List>
</div>

<style>
  .dish-list :global(.item) {
    padding: 0 12px;
  }

  :global(.list.removing) .recipe-indicator {
    opacity: 0;
  }

  .dish-item {
    display: flex;
    flex: 1 1 auto;
  }

  .dish-name {
    flex: 1 1 auto;
  }

  .recipe-indicator {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    transition: 0.1s all;
  }
</style>
