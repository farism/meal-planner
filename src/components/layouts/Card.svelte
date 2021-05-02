<div class="card">
  <slot />
</div>

<style>
  .card {
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px;
    width: 100%;
  }

  :global(.card + .card) {
    margin-top: 12px;
  }
</style>
