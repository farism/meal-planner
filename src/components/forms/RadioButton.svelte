<script lang="ts">
  export let value: string | number = ''
  export let group: string | number = ''
</script>

<label>
  <input type="radio" {value} bind:group on:change />
  <span class="checkbox">
    <span class="checkmark" />
  </span>
  <span class="text">
    <slot />
  </span>
</label>

<style>
  label {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  input {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }

  input:focus + .checkbox {
    border-color: var(--border-color);
  }

  input:checked + .checkbox .checkmark {
    background: var(--primary-color);
    margin: 4px;
  }

  .checkbox {
    display: inline-flex;
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    border-color: var(--border-color);
    border-radius: 100%;
    border-style: solid;
    border-width: 2px;
  }

  .checkmark {
    border-radius: 100%;
    flex: 1 1 auto;
    margin: 8px;
    transition: 0.2s all;
  }

  .text {
    display: inline-flex;
    flex: 1 1 auto;
    margin-left: 12px;
  }
</style>
