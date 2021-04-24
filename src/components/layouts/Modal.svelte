<script lang="ts">
  import { fade } from 'svelte/transition'
  import ModalHeader from './ModalHeader.svelte'

  export let visible = false

  function hide() {
    visible = false
  }
</script>

{#if visible}
  <div class="scrim" in:fade|local={{ duration: 150 }} on:click={hide} />
  <div class="modal" in:fade|local={{ duration: 150 }}>
    <ModalHeader onClickDismiss={hide}>
      <slot name="header" />
    </ModalHeader>
    <div class="body">
      <slot />
    </div>
  </div>
{/if}

<style>
  .scrim {
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
  }

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

  .body {
  }
</style>
