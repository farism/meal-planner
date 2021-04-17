<script lang="ts">
  import PlusIcon from 'svelte-feather-icons/src/icons/PlusIcon.svelte'
  import TrashIcon from 'svelte-feather-icons/src/icons/TrashIcon.svelte'
  import XIcon from 'svelte-feather-icons/src/icons/XIcon.svelte'
  import { scale } from 'svelte/transition'
  import { spin } from '../../transitions/spin'
  import FAB from './FAB.svelte'

  export let onClickAdd = () => {}

  export let onClickRemove = () => {}

  export let isRemoving = false

  let disabled = false

  function enable() {
    disabled = false
  }

  function disable() {
    disabled = true
  }
</script>

<FAB on:click={onClickAdd}>
  <PlusIcon size="24" />
</FAB>

<FAB
  {disabled}
  color="warning"
  offset={{ x: 0, y: -64 }}
  on:click={onClickRemove}
>
  {#if isRemoving}
    <span class="icon" in:spin|local>
      <XIcon size="24" slot="icon2" />
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
      <TrashIcon size="24" slot="icon1" />
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
