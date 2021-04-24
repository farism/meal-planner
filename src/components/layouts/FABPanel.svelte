<div class="fab-panel">
  <slot />
</div>

<style>
  .fab-panel {
    bottom: 66px;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 16px;
  }

  .fab-panel > :global(button) {
    margin-top: 16px;
  }
</style>
