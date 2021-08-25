<script>
  import UserIcon from 'svelte-feather-icons/src/icons/UserIcon.svelte'
</script>

<button on:click>
  <UserIcon size="24" />
  <span>Sign in Anonymously</span>
</button>

<div class="disclaimer">
  * Data will be lost when signing out of an anonymous account. You can link it
  with your email later.
</div>

<style>
  button {
    align-items: center;
    background: transparent;
    border: 0;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    padding: 12px;
    width: 100%;
  }

  button:active {
    background: var(--secondary-color-light);
  }

  :global(body.dark-mode) button {
    border: 1px solid var(--body-color);
  }

  button :global(svg) {
    color: var(--body-color);
    height: 32px;
    margin-right: 16px;
    width: 32px;
  }

  span {
    color: var(--body-color);
    font-size: 24px;
  }

  .disclaimer {
    color: var(--secondary-color);
    line-height: 24px;
    padding: 24px;
    text-align: center;
  }
</style>
