<script>
  export let disabled = false
  export let secondary = false
  export let warning = false

  let primary = !secondary && !warning
</script>

<button {disabled} class:primary class:secondary class:warning on:click
  ><slot /></button
>

<style>
  button {
    -webkit-touch-callout: none; /* iOS Safari */
    align-items: center;
    background: white;
    border-radius: 4px;
    border-style: solid;
    border-width: 2px;
    display: flex;
    font-size: var(--button-font-size);
    font-weight: 700;
    height: var(--button-height);
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0 12px;
    text-decoration: none;
    transition: 0.1s all ease-out;
    user-select: none;
    width: 100%;
  }

  button:active {
    box-shadow: 0 0 10px rgb(0, 0, 0, 0.2);
  }

  button.primary {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  button.primary:active {
    border-color: white;
  }

  button.secondary {
    border-color: var(--border-color);
    color: var(--secondary-color);
  }

  button.secondary:disabled {
    border-color: var(--border-color-disabled);
    color: var(--secondary-color-light);
  }

  button.warning {
    border-color: var(--warning-color);
    color: var(--warning-color);
  }
</style>
