<script lang="ts">
  import dayjs from 'dayjs'
  import type { Meal, MealTime, PantryItem, Recipe } from 'src/types'
  import ChevronLeftIcon from 'svelte-feather-icons/src/icons/ChevronLeftIcon.svelte'
  import ChevronRightIcon from 'svelte-feather-icons/src/icons/ChevronRightIcon.svelte'
  import { readable } from 'svelte/store'
  import Button from '../components/buttons/Button.svelte'
  import Calendar from '../components/Calendar.svelte'
  import BottomSheet from '../components/layouts/BottomSheet.svelte'
  import List from '../components/layouts/List.svelte'
  import Modal from '../components/layouts/Modal.svelte'
  import Tabs from '../components/layouts/Tabs.svelte'
  import { canEdit, getDocsFromCache } from '../firebase'

  export let location = ''

  const defaultMeal: Meal = {
    id: null,
    uid: null,
    dishes: [],
  }

  const upcoming = readable(
    Array.from(Array(7).keys()).map((i) => {
      const date = dayjs().add(i, 'day')

      return {
        name: date.format('MMMM D'),
        date,
      }
    }),
    () => {}
  )

  let date = dayjs()

  let activeDate = date

  let showBottomSheet = false

  let showCalendarView = true

  let showModal = false

  let showModalRecipes = true

  let activeMeal = { ...defaultMeal }

  let recipes = getDocsFromCache('recipes')

  let pantry = getDocsFromCache('pantry')

  $: breakfast = activeMeal.dishes.filter((d) => d.mealTime === 'Breakfast')

  $: lunch = activeMeal.dishes.filter((d) => d.mealTime === 'Lunch')

  $: dinner = activeMeal.dishes.filter((d) => d.mealTime === 'Dinner')

  function onClickTab(i: number) {
    showCalendarView = i === 0
  }

  function onClickModalTab(i: number) {
    showModalRecipes = i === 0
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
    showModal = true
  }

  function onSelectRecipe(recipe: Recipe) {
    showModal = false
  }

  function onSelectPantryItem(item: PantryItem) {
    showModal = false
  }
</script>

<Tabs tabs={['Calendar', 'Upcoming']} {onClickTab} />

{#if showCalendarView}
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
  <Calendar bind:date {onClickDate} />
{:else}
  <List keyField="name" docs={upcoming} onClick={onClickUpcoming} />
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

  {#if $canEdit}
    <div>
      <div class="card">
        <ul>
          {#each breakfast as b}
            <li>{b.name}</li>
          {/each}
        </ul>
        <Button secondary on:click={() => onClickAddDish('Breakfast')}>
          + Breakfast
        </Button>
      </div>
      <div class="card">
        <ul>
          {#each lunch as dish}
            <li>{dish.name}</li>
          {/each}
        </ul>
        <Button secondary on:click={() => onClickAddDish('Lunch')}>
          + Lunch
        </Button>
      </div>
      <div class="card">
        <ul>
          {#each dinner as dish}
            <li>{dish.name}</li>
          {/each}
        </ul>
        <Button secondary on:click={() => onClickAddDish('Dinner')}>
          + Dinner
        </Button>
      </div>
    </div>
  {/if}
</BottomSheet>

<Modal bind:visible={showModal}>
  <div slot="header">Select Dish</div>
  <div class="modal-body">
    <Tabs onClickTab={onClickModalTab} tabs={['Recipes', 'Pantry']} />
    {#if showModalRecipes}
      <List docs={recipes} onClick={onSelectRecipe} />
    {:else}
      <List docs={pantry} onClick={onSelectPantryItem} />
    {/if}
  </div>
</Modal>

<style>
  .calendar-controls {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }

  .calendar-controls.no-pad {
    margin-right: 24px;
    padding: 0;
  }

  .calendar-controls :global(button) {
    padding: 4px;
    width: var(--button-height);
  }

  .month-year {
    font-size: 24px;
  }

  .card {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 4px;
    padding: 16px;
  }

  .card + .card {
    margin-top: 24px;
  }

  .modal-body {
    padding: 0 30px 30px 30px;
  }
</style>
