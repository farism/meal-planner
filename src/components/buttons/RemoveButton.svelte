<script>
  import MinusCircle from 'svelte-feather-icons/src/icons/MinusCircleIcon.svelte'
</script>

<button class={$$props.class} on:click>
  <MinusCircle size="24" />
</button>

<style>
  button {
    align-items: center;
    background: none;
    border: none;
    color: var(--warning-color);
    display: flex;
    height: 36px;
    justify-content: center;
    outline: none;
    padding: 0;
    width: 36px;
  }
</style>
