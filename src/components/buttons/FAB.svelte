<script lang="ts">
  type Color = 'primary' | 'secondary' | 'warning'

  export let color: Color = 'primary'
  export let offset = { x: 0, y: 0 }
  export let disabled = false

  $: style = `color: ${color}; transform: translate(${offset.x}px, ${offset.y}px)`
</script>

<button class={color} on:click {style} {disabled}>
  <slot />
</button>

<style>
  button {
    align-items: center;
    border-radius: 100%;
    border: none;
    bottom: 66px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    color: white;
    display: flex;
    height: 48px;
    justify-content: center;
    outline: none;
    position: fixed;
    right: 16px;
    user-select: none;
    width: 48px;
  }

  button.primary {
    background: var(--primary-color);
  }

  button.secondary {
    background: var(--secondary-color);
  }

  button.warning {
    background: var(--warning-color);
  }
</style>
