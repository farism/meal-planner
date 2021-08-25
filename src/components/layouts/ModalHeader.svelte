<script lang="ts">
  import X from 'svelte-feather-icons/src/icons/XIcon.svelte'

  export let onClickDismiss = () => {}
</script>

<div class="header">
  <h2>
    <slot />
  </h2>
  <button class="dismiss" on:click={onClickDismiss}>
    <X size="24" />
  </button>
</div>

<style>
  .header {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    padding: 30px;
  }

  h2 {
    flex: 1 1 auto;
    margin: 0;
  }

  .dismiss {
    align-items: center;
    background: none;
    border: none;
    color: var(--body-color);
    display: flex;
    flex: 0 0 auto;
    height: 32px;
    justify-content: center;
    outline: none;
    margin-left: 12px;
    padding: 0;
    width: 32px;
  }
</style>
