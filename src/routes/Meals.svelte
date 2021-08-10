<script lang="ts">
  import dayjs from 'dayjs'
  import ChevronLeftIcon from 'svelte-feather-icons/src/icons/ChevronLeftIcon.svelte'
  import ChevronRightIcon from 'svelte-feather-icons/src/icons/ChevronRightIcon.svelte'
  import PlusIcon from 'svelte-feather-icons/src/icons/PlusIcon.svelte'
  import type { NavigateFn } from 'svelte-navigator'
  import { derived, get, readable } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import FabRemove from '../components/buttons/FABRemove.svelte'
  import Calendar from '../components/Calendar.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Card from '../components/layouts/Card.svelte'
  import DishList from '../components/layouts/DishList.svelte'
  import FabPanel from '../components/layouts/FABPanel.svelte'
  import List from '../components/layouts/List.svelte'
  import Modal from '../components/layouts/Modal.svelte'
  import Tabs from '../components/layouts/Tabs.svelte'
  import ScrollShadow from '../components/utils/ScrollShadow.svelte'
  import {
    canEdit,
    fromTimestamp,
    getCalendarDishes,
    getDocs,
    getUpcomingDishes,
    loading,
    removeDish,
    saveDish,
    settings,
  } from '../firebase'
  import type { Dish, DishType, MealTime, PantryItem, Recipe } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  const staticUpcomingDates = readable(
    Array.from(Array(7).keys()).map((i) => dayjs().add(i, 'day')),
    () => {}
  )

  let date = dayjs()

  let activeDate = date

  let showBottomSheet = false

  let showModal = false

  let mealViewTab = get(settings).mealView

  let selectDishTab = 0

  let isRemoving = false

  let activeMealTime: MealTime = 'Breakfast'

  let recipes = getDocs<Recipe>('recipes')

  let pantry = getDocs<PantryItem>('pantry')

  $: dateStr = date.startOf('month').toISOString()

  $: calendarDishes = derived(getCalendarDishes(dateStr), (d) =>
    d.map((dish) => ({ ...dish, date: fromTimestamp(dish.date) }))
  )

  $: upcomingDishes = derived(getUpcomingDishes(), (d) =>
    d.map((dish) => ({ ...dish, date: fromTimestamp(dish.date) }))
  )

  $: upcomingDates = derived([staticUpcomingDates, upcomingDishes], ([u, d]) =>
    u.map((date) => ({
      date,
      dishes: readable(
        d.filter((dish) => dish.date.isSame(date, 'day')),
        () => {}
      ),
    }))
  )

  $: activeDateDishes = derived(calendarDishes, (d) =>
    d.filter(({ date }) => date.isSame(activeDate, 'day'))
  )

  $: breakfast = derived(activeDateDishes, (d) =>
    d.filter(({ mealTime }) => mealTime === 'Breakfast')
  )

  $: lunch = derived(activeDateDishes, (d) =>
    d.filter(({ mealTime }) => mealTime === 'Lunch')
  )

  $: dinner = derived(activeDateDishes, (d) =>
    d.filter(({ mealTime }) => mealTime === 'Dinner')
  )

  function onClickRemove() {
    isRemoving = !isRemoving
  }

  function onRemoveDish(dish: Dish) {
    removeDish(dish)
  }

  function prevMonth() {
    date = date.subtract(1, 'month')
  }

  function nextMonth() {
    date = date.add(1, 'month')
  }

  function prevDay() {
    activeDate = activeDate.subtract(1, 'day')
    date = activeDate
  }

  function nextDay() {
    activeDate = activeDate.add(1, 'day')
    date = activeDate
  }

  function onClickDate(d: dayjs.Dayjs) {
    activeDate = d
    showBottomSheet = true
  }

  function onClickAddDish(mealTime: MealTime) {
    activeMealTime = mealTime
    showModal = true
  }

  function onClickDish(dish: Dish) {
    if (dish.recipe?.id) {
      navigate(`/recipes/${dish.recipe?.id}`)
    }
  }

  function save({ recipe, item }: { recipe?: Recipe; item?: PantryItem }) {
    const type: DishType = recipe ? 'Recipe' : 'PantryItem'

    const dish: Dish = {
      id: null,
      uid: null,
      date: activeDate.toDate(),
      mealTime: activeMealTime,
      type,
    }

    if (recipe) {
      dish.recipe = recipe
    }

    if (item) {
      dish.item = item
    }

    saveDish(dish)
  }

  function onSelectRecipe(recipe: Recipe) {
    save({ recipe })

    showModal = false
  }

  function onSelectPantryItem(item: PantryItem) {
    save({ item })

    showModal = false
  }
</script>

<div class="tabs">
  <Tabs tabs={['Upcoming', 'Calendar']} bind:active={mealViewTab} />
</div>

{#if mealViewTab === 0 && !$loading['dishes']}
  <div class="upcoming-list">
    {#each $upcomingDates as d}
      <Card>
        <div class="upcoming-item" on:click={() => onClickDate(d.date)}>
          <PlusIcon size="24" />
          <div class="upcoming-label">
            {d.date.format('MMMM D')}
          </div>
        </div>
        {#if get(d.dishes).length > 0}
          <div class="upcoming-list-wrapper">
            <DishList
              docs={d.dishes}
              onClick={onClickDish}
              onRemove={onRemoveDish}
              removing={isRemoving && !showBottomSheet}
              emptyMessage=""
            />
          </div>
        {/if}
      </Card>
    {/each}
  </div>
{:else if mealViewTab === 1}
  <div class="calendar-controls">
    <Button secondary on:click={prevMonth}>
      <ChevronLeftIcon />
    </Button>
    <div class="month-year">
      {date.format('MMMM YYYY')}
    </div>
    <Button secondary on:click={nextMonth}>
      <ChevronRightIcon />
    </Button>
  </div>
  <Calendar bind:date events={calendarDishes} {onClickDate} />
{/if}

{#if $canEdit}
  <div class="fab-panel">
    <FabPanel>
      {#if $canEdit}
        <FabRemove on:click={onClickRemove} {isRemoving} />
      {/if}
    </FabPanel>
  </div>
{/if}

<BottomSheet heading={''} bind:open={showBottomSheet}>
  <div class="calendar-controls bottom-sheet" slot="heading">
    <Button secondary on:click={prevDay}>
      <ChevronLeftIcon />
    </Button>
    <span class="month-year">
      {activeDate.format('MMMM D')}
    </span>
    <Button secondary on:click={nextDay}>
      <ChevronRightIcon />
    </Button>
  </div>

  <div>
    {#if $settings.showBreakfast}
      <Card>
        {#if $canEdit}
          <Button secondary on:click={() => onClickAddDish('Breakfast')}>
            + Breakfast
          </Button>
        {/if}
        <div class="dish-list">
          <DishList
            docs={breakfast}
            onClick={onClickDish}
            onRemove={onRemoveDish}
            removing={isRemoving}
          />
        </div>
      </Card>
    {/if}

    {#if $settings.showLunch}
      <Card>
        {#if $canEdit}
          <Button secondary on:click={() => onClickAddDish('Lunch')}>
            + Lunch
          </Button>
        {/if}
        <div class="dish-list">
          <DishList
            docs={lunch}
            onClick={onClickDish}
            onRemove={onRemoveDish}
            removing={isRemoving}
          />
        </div>
      </Card>
    {/if}

    {#if $settings.showDinner}
      <Card>
        {#if $canEdit}
          <Button secondary on:click={() => onClickAddDish('Dinner')}>
            + Dinner
          </Button>
        {/if}
        <div class="dish-list">
          <DishList
            docs={dinner}
            onClick={onClickDish}
            onRemove={onRemoveDish}
            removing={isRemoving}
          />
        </div>
      </Card>
    {/if}
  </div>
</BottomSheet>

<Modal bind:visible={showModal}>
  <div slot="header">Select Dish</div>
  <div class="modal-body">
    <Tabs tabs={['Recipes', 'Pantry']} bind:active={selectDishTab} />
    <div class="modal-list">
      <ScrollShadow shadowSize={15}>
        {#if selectDishTab === 0}
          <List docs={recipes} onClick={onSelectRecipe} />
        {:else}
          <List docs={pantry} onClick={onSelectPantryItem} />
        {/if}
      </ScrollShadow>
    </div>
  </div>
</Modal>

<style>
  .fab-panel {
    position: relative;
    z-index: 20;
  }

  .tabs {
    position: sticky;
    top: 0;
    z-index: 3;
  }

  .upcoming-list {
    padding: 30px;
  }

  .upcoming-item {
    display: flex;
    align-items: center;
  }

  .upcoming-label {
    flex: 1 1 auto;
    margin-left: 12px;
    font-size: 24px;
  }

  .upcoming-list-wrapper {
    margin-top: 12px;
  }

  .calendar-controls {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding: 16px;
  }

  .calendar-controls.bottom-sheet {
    margin: 0 24px 0 0;
    padding: 0;
  }

  .calendar-controls.bottom-sheet .month-year {
    font-size: 16px;
  }

  .calendar-controls.bottom-sheet :global(button) {
    --button-height: 36px;
  }

  .calendar-controls :global(button) {
    padding: 4px;
    width: var(--button-height);
  }

  .month-year {
    font-size: 24px;
    padding: 6px 12px;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .modal-list {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .dish-list {
    margin-top: 16px;
  }
</style>
