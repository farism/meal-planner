<script lang="ts">
  export let name = ''
  export let value = ''
  export let ref: HTMLSelectElement | null = null
</script>

<select {name} bind:value bind:this={ref} class:hasValue={value !== ''}>
  <slot />
</select>

<style>
  select {
    -webkit-appearance: none;
    -webkit-text-fill-color: var(--input-placeholder-color);
    background: white;
    background-image: linear-gradient(
        45deg,
        transparent 50%,
        var(--border-color) 50%
      ),
      linear-gradient(135deg, var(--border-color) 50%, transparent 50%);
    background-position: calc(100% - 20px) calc(18px),
      calc(100% - 15px) calc(18px);
    background-size: 5px 5px, 5px 5px, 1.5em 1.5em;
    background-repeat: no-repeat;
    border-color: var(--border-color);
    border-radius: 4px;
    border-style: solid;
    border-width: var(--input-border-width);
    box-sizing: border-box;
    color: #333;
    display: flex;
    font-size: var(--input-font-size);
    height: var(--input-height);
    outline: none;
    padding: 0 36px 0 12px;
    transition: 0.2s border ease-out;
    width: 100%;
  }

  select.hasValue {
    -webkit-text-fill-color: var(--body-color);
  }

  select:focus {
    border-color: var(--primary-color-light);
    background-image: linear-gradient(
        45deg,
        transparent 50%,
        var(--primary-color-light) 50%
      ),
      linear-gradient(135deg, var(--primary-color-light) 50%, transparent 50%);
  }
</style>
