<script lang="ts">
  import dayjs from 'dayjs'

  export let location = ''

  const fiveWeeks = Array.from(Array(5 * 7).keys())

  const sixWeeks = Array.from(Array(6 * 7).keys())

  let date = dayjs()

  $: startOfMonth = date.startOf('month')

  $: endOfMonth = date.endOf('month')

  $: calendarStartDate = startOfMonth.subtract(startOfMonth.day(), 'day')

  $: calendarDaysCount = startOfMonth.day() + startOfMonth.daysInMonth()

  $: weeks = calendarDaysCount > 35 ? sixWeeks : fiveWeeks

  $: calendarDates = weeks.map((i) => calendarStartDate.add(i, 'days'))

  function isAdjacent(date: dayjs.Dayjs) {
    return date.isBefore(startOfMonth) || date.isAfter(endOfMonth)
  }

  function prev() {
    date = date.subtract(1, 'month')
  }

  function next() {
    date = date.add(1, 'month')
  }
</script>

<h1>Meal Plans</h1>

<button on:click={prev}>prev</button>
<button on:click={next}>next</button>

{date.toString()}

<div class="calendar">
  <div class="head">
    <div class="cell">Su</div>
    <div class="cell">Mo</div>
    <div class="cell">Tu</div>
    <div class="cell">We</div>
    <div class="cell">Th</div>
    <div class="cell">Fr</div>
    <div class="cell">Sa</div>
  </div>
  <div class="body">
    {#each calendarDates as date}
      <div class="cell" class:adjacent={isAdjacent(date)}>
        {date.date()}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar {
    width: 100%;
  }

  .head {
    border-bottom: 1px solid black;
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(7, 1fr);
    height: 48px;
  }

  .head .cell {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .body {
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(7, 1fr);
  }

  .body .cell {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .body .cell.adjacent {
    color: #aaa;
  }

  .body .cell::before {
    content: '';
    display: flex;
    width: 0;
    height: 0;
    padding-bottom: calc(100%);
  }
</style>
