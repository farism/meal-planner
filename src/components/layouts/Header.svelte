<div class="header">
  <h1>
    <slot />
  </h1>
</div>

<style>
  .header {
    display: flex;
    border-bottom: 1px solid #ccc;
    justify-content: center;
    margin: 0 -100px 24px -100px;
    padding: 12px 0;
    align-items: center;
    position: relative;
  }

  h1 {
    margin: 0;
  }
</style>
