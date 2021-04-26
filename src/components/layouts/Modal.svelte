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
  <div class="modal">
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
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9998;
  }

  .modal {
    background: white;
    border-radius: 8px;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    height: 80%;
    left: 10%;
    position: fixed;
    top: 10%;
    width: 80%;
    z-index: 9999;
  }

  .body {
    flex: 1 1 auto;
    display: flex;
    height: auto;
    min-height: 0;
  }
</style>
