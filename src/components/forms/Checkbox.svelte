<script lang="ts">
  import { draw } from 'svelte/transition'

  export let checked: boolean = false

  export let disabled: boolean = false
</script>

<label>
  <input type="checkbox" bind:checked {disabled} />
  <span class="checkbox">
    {#if checked}
      <svg
        class="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <g fill="none">
          <path
            in:draw={{ duration: 200 }}
            stroke-width="3"
            d="M2 8 l5 5 l8 -10"
          />
        </g>
      </svg>
    {/if}
  </span>
  <span class="text">
    <slot />
  </span>
</label>

<style>
  label {
    -webkit-touch-callout: none; /* iOS Safari */
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 24px;
    position: relative;
    user-select: none;
  }

  input {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }

  input:checked + .checkbox {
    border-color: var(--primary-color);
  }
  input:checked:disabled + .checkbox {
    border-color: var(--primary-color-light);
  }

  input:checked:disabled + .checkbox .checkmark {
    stroke: var(--primary-color-light);
  }

  .checkbox {
    align-items: center;
    border-color: var(--border-color);
    border-style: solid;
    border-width: 2px;
    display: inline-flex;
    flex: 0 0 auto;
    height: 20px;
    justify-content: center;
    position: relative;
    transition: 0.2s color ease-out;
    width: 20px;
  }

  .checkmark {
    position: absolute;
    stroke: var(--primary-color);
    transform: translateX(50%, 50%);
  }

  .text {
    display: inline-flex;
    flex: 1 1 auto;
    margin-left: 12px;
  }
</style>
