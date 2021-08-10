<script lang="ts">
  export let placeholder = ''
  export let value = ''
  export let name = ''
  export let inputmode = 'text'
  export let ref: HTMLInputElement | null = null
</script>

<input
  on:click
  on:focus
  on:blur
  on:input
  on:change
  on:keydown
  on:keyup
  on:keypress
  bind:value
  bind:this={ref}
  {inputmode}
  {name}
  {placeholder}
/>

<style>
  input {
    -webkit-appearance: none;
    background: white;
    border-color: var(--border-color);
    border-radius: 4px;
    border-style: solid;
    border-width: var(--input-border-width);
    box-sizing: border-box;
    color: var(--body-color);
    display: flex;
    font-size: var(--input-font-size);
    height: var(--input-height);
    outline: none;
    padding: 0 12px;
    transition: 0.2s border ease-out;
    width: 100%;
  }

  input:focus {
    border-color: var(--primary-color-light);
    box-shadow: 0 0 1px rgba();
  }

  input::placeholder {
    color: var(--input-placeholder-color);
  }
</style>
