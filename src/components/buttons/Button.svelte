<script>
  export let secondary = false
</script>

<button class:secondary on:click><slot /></button>

<style>
  button {
    align-items: center;
    background: transparent;
    border-color: var(--primary-color);
    border-radius: 4px;
    border-style: solid;
    border-width: 2px;
    color: var(--primary-color);
    display: flex;
    width: 100%;
    font-size: var(--button-font-size);
    font-weight: 700;
    height: var(--button-height);
    justify-content: center;
    outline: none;
    padding: 0 12px;
    user-select: none;
    transition: 0.1s all ease-out;
  }

  button:active {
    border-color: white;
    box-shadow: 0 0 15px rgb(0, 0, 0, 0.3);
  }

  button.secondary,
  button.secondary:active {
    color: var(--secondary-color);
    border-color: var(--border-color);
    box-shadow: none;
  }
</style>
