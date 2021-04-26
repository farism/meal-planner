<script lang="ts">
  import dayjs from 'dayjs'
  import type { Dish, DishType, MealTime, PantryItem, Recipe } from 'src/types'
  import ChevronLeftIcon from 'svelte-feather-icons/src/icons/ChevronLeftIcon.svelte'
  import ChevronRightIcon from 'svelte-feather-icons/src/icons/ChevronRightIcon.svelte'
  import { navigate } from 'svelte-navigator'
  import { derived, get, readable } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import Calendar from '../components/Calendar.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import Card from '../components/layouts/Card.svelte'
  import DishList from '../components/layouts/DishList.svelte'
  import List from '../components/layouts/List.svelte'
  import Modal from '../components/layouts/Modal.svelte'
  import Tabs from '../components/layouts/Tabs.svelte'
  import ScrollShadow from '../components/utils/ScrollShadow.svelte'
  import {
    canEdit,
    fromTimestamp,
    getCalendarDishes,
    getDocs,
    loading,
    removeDish,
    saveDish,
    settings,
    getUpcomingDishes,
  } from '../firebase'

  export let location = ''

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

  let isRemovingBreakfast = false

  let isRemovingLunch = false

  let isRemovingDinner = false

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

  function onClickTab(i: number) {
    date = dayjs()
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

  function onClickUpcoming({ date }: { date: dayjs.Dayjs }) {
    onClickDate(date)
  }

  function onClickAddDish(mealTime: MealTime) {
    activeMealTime = mealTime
    showModal = true
  }

  function onClickRemove(dish: Dish) {
    removeDish(dish)
  }

  function onClickDish(dish: Dish) {
    console.log(dish)
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
  <Tabs tabs={['Calendar', 'Upcoming']} bind:active={mealViewTab} />
</div>

{#if mealViewTab === 0}
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
{:else if !$loading['dishes']}
  <div class="upcoming-list">
    {#each $upcomingDates as d}
      <Card>
        <div class="month-year" on:click={() => onClickDate(d.date)}>
          {d.date.format('MMMM DD')}
        </div>
        <DishList docs={d.dishes} onClick={onClickDish} emptyMessage="" />
      </Card>
    {/each}
  </div>
{/if}

<BottomSheet
  heading={''}
  open={showBottomSheet}
  onClickDismiss={() => (showBottomSheet = false)}
>
  <div class="calendar-controls no-pad" slot="heading">
    <Button secondary on:click={prevDay}>
      <ChevronLeftIcon />
    </Button>
    <span class="month-year">
      {activeDate.format('MMMM DD')}
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
            onRemove={onClickRemove}
            isRemoving={isRemovingBreakfast}
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
            onRemove={onClickRemove}
            isRemoving={isRemovingLunch}
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
            onRemove={onClickRemove}
            isRemoving={isRemovingDinner}
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
  .tabs {
    position: sticky;
    top: 0;
    z-index: 9;
  }

  .upcoming-list {
    padding: 30px;
  }

  .calendar-controls {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding: 16px;
  }

  .calendar-controls.no-pad {
    margin: 0 24px 0 0;
    padding: 0;
  }

  .calendar-controls :global(button) {
    padding: 4px;
    width: var(--button-height);
  }

  .month-year {
    font-size: 24px;
    padding: 6px 30px;
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
