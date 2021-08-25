<script lang="ts">
  export let name = ''
  export let value = ''
  export let ref: HTMLSelectElement | null = null
</script>

<select {name} bind:value bind:this={ref} class:hasValue={Boolean(value)}>
  <slot />
</select>

<style>
  select {
    -webkit-appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6' fill='%23bcbcbc'><polygon points='0,0 12,0 6,6'/></svg>");
    background-repeat: no-repeat;
    background-position: calc(100% - 16px) center;
    border-color: var(--border-color);
    border-radius: 4px;
    border-style: solid;
    border-width: var(--input-border-width);
    box-sizing: border-box;
    color: var(--input-placeholder-color);
    display: flex;
    font-size: var(--input-font-size);
    height: var(--input-height);
    outline: none;
    padding: 0 36px 0 12px;
    transition: 0.2s border ease-out;
    width: 100%;
  }

  select.hasValue {
    color: rgb(51, 51, 51);
  }

  select:focus {
    border-color: var(--primary-color-light);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6' fill='%23b6ecb6'><polygon points='0,0 12,0 6,6'/></svg>");
  }
</style>
