<script lang="ts">
  export let placeholder = ''
  export let value = ''
  export let name = ''
  export let ref: HTMLTextAreaElement | null = null
</script>

<textarea bind:value bind:this={ref} {name} {placeholder} />

<style>
  textarea {
    -webkit-appearance: none;
    background: white;
    border-color: var(--border-color);
    border-radius: 4px;
    border-style: solid;
    border-width: var(--input-border-width);
    box-sizing: border-box;
    color: rgb(51, 51, 51);
    display: flex;
    font-family: inherit;
    font-size: var(--input-font-size);
    height: var(--textarea-height);
    outline: none;
    padding: 6px;
    resize: none;
    transition: 0.2s border ease-out;
    width: 100%;
  }

  textarea:focus {
    border-color: var(--primary-color-light);
    box-shadow: 0 0 1px rgba();
  }

  textarea::placeholder {
    color: var(--input-placeholder-color);
  }
</style>
