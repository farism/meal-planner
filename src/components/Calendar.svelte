<script lang="ts">
  import dayjs from 'dayjs'

  export let date = dayjs()

  export let onClickDate = (d: dayjs.Dayjs) => {}

  $: startOfMonth = date.startOf('month')

  $: endOfMonth = date.endOf('month')

  $: calendarStartDate = startOfMonth.subtract(startOfMonth.day(), 'day')

  $: calendarDaysCount = startOfMonth.day() + startOfMonth.daysInMonth()

  $: weeks = Array.from(Array(Math.ceil(calendarDaysCount / 7) * 7).keys())

  $: calendarDates = weeks.map((i) => calendarStartDate.add(i, 'days'))

  function isToday(d: dayjs.Dayjs) {
    return d.isSame(dayjs(), 'date')
  }

  function isAdjacent(d: dayjs.Dayjs) {
    return d.isBefore(startOfMonth) || d.isAfter(endOfMonth)
  }

  function isUpcoming(d: dayjs.Dayjs) {
    return (
      d.isAfter(dayjs().subtract(1, 'day')) && d.isBefore(dayjs().add(6, 'day'))
    )
  }
</script>

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
    {#each calendarDates as d}
      <div
        class="cell"
        class:today={isToday(d)}
        class:adjacent={isAdjacent(d)}
        class:upcoming={isUpcoming(d)}
        on:click={() => onClickDate(d)}
      >
        {d.date()}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar {
    -webkit-touch-callout: none; /* iOS Safari */
    user-select: none;
    width: 100%;
  }

  .head {
    border-bottom: 1px solid black;
    display: grid;
    gap: 4px;
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
    gap: 4px;
    grid-template-columns: repeat(7, 1fr);
  }

  .body .cell {
    align-items: center;
    display: flex;
    justify-content: center;
    transition: 0.2s all;
  }

  .body .cell.adjacent {
    color: #aaa;
  }

  .body .cell.upcoming {
    background-color: var(--primary-color-light2);
  }

  .body .cell.today {
    background-color: var(--secondary-color-light);
    font-weight: 700;
  }

  .body .cell::before {
    content: '';
    display: flex;
    width: 0;
    height: 0;
    padding-bottom: calc(100%);
  }
</style>
