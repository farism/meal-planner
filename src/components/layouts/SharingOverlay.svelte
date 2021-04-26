<script lang="ts">
  import Users from 'svelte-feather-icons/src/icons/UsersIcon.svelte'
  import { fade } from 'svelte/transition'
  import { settings } from '../../firebase'
  import Button from '../buttons/Button.svelte'

  let open = false

  function toggleOpen() {
    open = !open
  }

  function useMyAccount() {
    open = false

    settings.update((s) => ({ ...s, activePermission: null }))

    window.location.reload()
  }
</script>

{#if $settings?.activePermission}
  {#if open}
    <div class="scrim" on:click={toggleOpen} />
  {/if}

  <div class="account-sharing">
    <div class="account-sharing-info" class:open>
      {#if open}
        <div in:fade|local>
          <div class="using-account">
            <div>Using account:</div>
            <b>{$settings.activePermission.email}</b>
          </div>
          <Button secondary on:click={useMyAccount}>Use my account</Button>
        </div>
      {:else}
        <div on:click={toggleOpen}>
          <Users size="24" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .scrim {
    background: rgba(255, 255, 255, 0.75);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
  }

  .account-sharing {
    border: 4px solid var(--primary-color);
    box-sizing: border-box;
    height: 100%;
    left: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  .account-sharing-info {
    align-items: center;
    background: var(--primary-color);
    border-bottom-left-radius: 4px;
    color: white;
    display: flex;
    height: 36px;
    justify-content: center;
    pointer-events: all;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.2s all ease-out;
    width: 36px;
  }

  .account-sharing-info.open {
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    height: 150px;
    width: 100%;
    line-height: 28px;
  }

  .using-account {
    text-align: center;
    color: var(--body-color);
    margin-bottom: 16px;
  }
</style>
