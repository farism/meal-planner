<script lang="ts">
  import { scale } from 'svelte/transition'

  export let visible = false
</script>

{#if visible}
  <div class="modal" in:scale>
    <slot />
  </div>
{/if}

<style>
  .modal {
    background: white;
    border-radius: 8px;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    height: 80vh;
    left: 10vw;
    position: fixed;
    top: 10vh;
    width: 80vw;
  }
</style>
