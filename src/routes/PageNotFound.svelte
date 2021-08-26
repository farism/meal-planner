<script lang="ts">
  import Header from '../components/layouts/Header.svelte'

  export let location: string = ''
</script>

<div class="header">
  <Header heading="Page not found" dynamicSize />
</div>

<div class="body">Could not find the page you are looking for</div>

<style>
  .body {
    padding: 30px;
    text-align: center;
    font-style: italic;
  }
</style>
