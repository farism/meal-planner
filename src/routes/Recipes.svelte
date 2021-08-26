<script lang="ts">
  import { orderBy } from 'lodash-es'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived } from 'svelte/store'
  import FABCreate from '../components/buttons/FABCreate.svelte'
  import FABRemove from '../components/buttons/FABRemove.svelte'
  import FABSettings from '../components/buttons/FABSettings.svelte'
  import Search from '../components/forms/Search.svelte'
  import FABPanel from '../components/layouts/FABPanel.svelte'
  import Header from '../components/layouts/Header.svelte'
  import List from '../components/layouts/List.svelte'
  import ListConfig from '../components/utils/ListConfig.svelte'
  import { canEdit, getDocs, loading, removeRecipe } from '../firebase'
  import type { Recipe } from '../types'

  export let location: string

  export let navigate: NavigateFn

  let isRemoving = false

  let sortByField = 'name'

  let sortDirection: 'asc' | 'desc' = 'asc'

  let search = ''

  $: searchCheck = search.trim().toLowerCase()

  $: noItems =
    $loading['recipes'] === false ? "You haven't created any recipes" : ''

  $: emptyMessage = searchCheck ? 'Could not find any search results' : noItems

  $: docs = getDocs<Recipe>('recipes')

  $: orderedDocs = derived(docs, ($docs) => {
    const ordered = orderBy($docs, [sortByField], [sortDirection])

    return searchCheck === ''
      ? ordered
      : ordered.filter((item) => item.name.toLowerCase().includes(searchCheck))
  })

  function onClickAdd() {
    navigate('/recipes/create')
  }

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function edit(recipe: Recipe) {
    navigate(`/recipes/${recipe.id}`)
  }

  function remove(recipe: Recipe) {
    removeRecipe(recipe)
  }
</script>

<div class="content">
  <Header>Recipes</Header>
  <Search bind:value={search} />
  <List
    {emptyMessage}
    docs={orderedDocs}
    removing={isRemoving}
    onRemove={remove}
    onClick={edit}
  />
</div>

<FABPanel>
  <FABSettings>
    <ListConfig
      bind:sort={sortByField}
      bind:direction={sortDirection}
      sortFields={{ name: 'Name', cuisine: 'Cuisine' }}
    />
  </FABSettings>
  {#if $canEdit}
    <FABRemove on:click={onClickRemove} {isRemoving} />
    <FABCreate on:click={onClickAdd} />
  {/if}
</FABPanel>

<style>
  :global(body.bottomsheet-open) .content {
    filter: blur(2px);
    transform: translateY(-36px) scale(0.9);
  }

  .content {
    transition: 0.2s transform ease-out;
  }
</style>
