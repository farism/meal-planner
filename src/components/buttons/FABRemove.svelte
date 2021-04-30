<script lang="ts">
  import TrashIcon from 'svelte-feather-icons/src/icons/TrashIcon.svelte'
  import XIcon from 'svelte-feather-icons/src/icons/XIcon.svelte'
  import { scale } from 'svelte/transition'
  import { spin } from '../../transitions/spin'
  import FAB from './FAB.svelte'

  export let isRemoving = false

  let disabled = false

  function enable() {
    disabled = false
  }

  function disable() {
    disabled = true
  }
</script>

<FAB color="warning" on:click {disabled}>
  {#if isRemoving}
    <span class="icon" in:spin|local>
      <XIcon size="24" />
    </span>
  {:else}
    <span
      class="icon"
      in:scale|local
      out:scale|local
      on:introstart={disable}
      on:introend={enable}
      on:outrostart={disable}
      on:outroend={enable}
    >
      <TrashIcon size="24" />
    </span>
  {/if}
</FAB>

<style>
  .icon {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
