<script>
  export let secondary = false
  export let warning = false
</script>

<button class:secondary class:warning on:click><slot /></button>

<style>
  button {
    align-items: center;
    background: white;
    border-color: var(--primary-color);
    border-radius: 4px;
    border-style: solid;
    border-width: 2px;
    color: var(--primary-color);
    display: flex;
    font-size: var(--button-font-size);
    font-weight: 700;
    height: var(--button-height);
    justify-content: center;
    outline: none;
    margin: 0;
    padding: 0 12px;
    text-decoration: none;
    transition: 0.1s all ease-out;
    -webkit-touch-callout: none; /* iOS Safari */
    user-select: none;
    width: 100%;
  }

  button:active {
    box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
  }

  button:not(.secondary):not(.warning):active {
    border-color: white;
  }

  button.secondary {
    color: var(--secondary-color);
    border-color: var(--border-color);
  }

  button.warning {
    color: var(--warning-color);
    border-color: var(--warning-color);
  }
</style>
