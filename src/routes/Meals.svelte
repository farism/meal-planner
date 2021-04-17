<script lang="ts">
  import dayjs from 'dayjs'
  import Calendar from '../components/Calendar.svelte'

  export let location = ''

  let date = dayjs()

  function prev() {
    date = date.subtract(1, 'month')
  }

  function next() {
    date = date.add(1, 'month')
  }
</script>

<h1>Meals</h1>

<button on:click={prev}>prev</button>

{date.format('MMMM YYYY')}

<button on:click={next}>next</button>

<Calendar bind:date />

<style>
</style>
