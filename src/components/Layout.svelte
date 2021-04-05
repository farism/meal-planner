<script lang="ts">
  import Navigation from './Navigation.svelte'
</script>

<div>
  <div class="navigation">
    <Navigation />
  </div>
  <div class="body">
    <slot />
  </div>
</div>

<style>
  .navigation {
    height: 40px;
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .body {
    min-height: calc(100vh - 40px);
    min-width: 100vw;
    overflow: hidden;
    position: relative;
  }
</style>
