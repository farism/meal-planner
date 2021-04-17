<script lang="ts">
  import ScrollShadow from '../utils/ScrollShadow.svelte'
  import Navigation from './Navigation.svelte'
</script>

<div class="body">
  <ScrollShadow isTopLevel={true}>
    <slot />
  </ScrollShadow>
</div>

<div class="navigation">
  <Navigation />
</div>

<style>
  :global(body.bottomsheet-open) .body {
    overflow: hidden;
  }

  .body {
    bottom: 50px;
    left: 0;
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  .navigation {
    height: 50px;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 2;
  }
</style>
