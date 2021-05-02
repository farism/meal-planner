<script lang="ts">
  import { authError } from '../../firebase'
  import Button from '../buttons/Button.svelte'
  import Modal from './Modal.svelte'

  $: showAuthError = $authError !== ''
</script>

<div class="auth-modal">
  <Modal bind:visible={showAuthError}>
    <div class="auth-error-header" slot="header">Sign In Error</div>
    <div class="auth-error">
      <div>
        {$authError}
      </div>
      <Button warning on:click={() => (showAuthError = false)}>Close</Button>
    </div>
  </Modal>
</div>

<style>
  .auth-error {
    color: var(--warning-color);
    padding: 24px;
    text-align: center;
  }

  .auth-error div {
    margin-bottom: 24px;
  }

  .auth-modal :global(svg) {
    stroke: var(--warning-color);
  }

  .auth-error-header {
    color: var(--warning-color);
  }
</style>
