<script lang="ts">
  import SearchIcon from 'svelte-feather-icons/src/icons/SearchIcon.svelte'
  export let placeholder = ''
  export let value = ''
  export let name = ''
  export let ref: HTMLInputElement | null = null
</script>

<div class="search">
  <input bind:value bind:this={ref} {name} {placeholder} />
  <div class="icon">
    <SearchIcon size="16" />
  </div>
</div>

<style>
  .search {
    position: relative;
    top: -1px;
  }

  .search:focus-within .icon {
    color: var(--primary-color);
  }

  input {
    -webkit-appearance: none;
    background: white;
    border-color: var(--border-color);
    border-style: solid;
    border-width: 1px;
    border-left: none;
    border-right: none;
    border-radius: 0;
    box-sizing: border-box;
    color: var(--body-color);
    display: flex;
    font-size: var(--input-font-size);
    height: var(--input-height);
    outline: none;
    padding: 0 48px 0 12px;
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

  .icon {
    margin-top: -8px;
    position: absolute;
    right: 16px;
    top: 50%;
    transition: 0.2s all ease-out;
  }
</style>
