<script lang="ts">
  import GoogleSignIn from '../components/buttons/GoogleSignIn.svelte'
  import type { NavigateFn } from 'svelte-navigator'
  import { Link } from 'svelte-navigator'
  import Button from '../components/buttons/Button.svelte'
  import Checkbox from '../components/forms/Checkbox.svelte'
  import RadioButton from '../components/forms/RadioButton.svelte'
  import Card from '../components/layouts/Card.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { linkAccount, logout, settings, user } from '../firebase'
  import type { Settings } from '../types'

  export let location = ''

  export let navigate: NavigateFn

  $: isAnonymous = $user && !$user.email

  function onChangeEnabledMealTime(time: keyof Settings) {
    return function (e: Event) {
      settings.update((s) => ({
        ...s,
        [time]: (e.target as HTMLInputElement).checked,
      }))
    }
  }

  function onChangeDefaultMealView(e: Event) {
    settings.update((s) => ({
      ...s,
      mealView: parseInt((e.target as HTMLInputElement).value as any, 10),
    }))
  }
</script>

<Header heading="Settings" />

<div id="settings">
  <div class="body">
    {#if $user}
      <div class="user">
        {#if isAnonymous}
          <div class="anonymous">
            <div>You are logged in anonymously.</div>
            <div>
              Please link your account if you would like to access extra
              features.
            </div>
            <GoogleSignIn on:click={linkAccount} />
          </div>
        {/if}
        {#if $user.photoURL}
          <div class="avatar">
            <img src={$user.photoURL} alt="User Photo" />
          </div>
        {/if}
        {#if $user.displayName}
          <div class="display-name">
            {$user.displayName}
          </div>
        {/if}
        <Card>
          <h5>Default Meal View</h5>
          <RadioButton
            bind:group={$settings.mealView}
            on:change={onChangeDefaultMealView}
            value={0}
          >
            Upcoming
          </RadioButton>
          <RadioButton
            bind:group={$settings.mealView}
            on:change={onChangeDefaultMealView}
            value={1}
          >
            Calendar
          </RadioButton>
        </Card>
        <Card>
          <h5>Enabled Meal Times</h5>
          <Checkbox
            checked={$settings?.showBreakfast}
            on:change={onChangeEnabledMealTime('showBreakfast')}
          >
            Show Breakfast
          </Checkbox>
          <Checkbox
            checked={$settings?.showLunch}
            on:change={onChangeEnabledMealTime('showLunch')}
          >
            Show Lunch
          </Checkbox>
          <Checkbox
            checked={$settings?.showDinner}
            on:change={onChangeEnabledMealTime('showDinner')}
          >
            Show Dinner
          </Checkbox>
        </Card>
        <Card>
          <h5>Account Sharing</h5>
          <div class="sharing">
            {#if $user.email}
              <Link to="/settings/share" disabled>
                <Button secondary>Share Account</Button>
              </Link>
            {:else}
              <div>Cannot share an anonymous account</div>
              <Button secondary disabled>Share Account</Button>
            {/if}
          </div>
        </Card>
        <Card>
          <h5>Session</h5>
          <div class="buttons">
            <Button warning on:click={logout}>Sign Out</Button>
            {#if isAnonymous}
              <div class="anonymous warning">
                Warning! You are currently using an anonymous account. If you
                sign out you will not be able to access your data.
              </div>
            {/if}
          </div>
        </Card>
      </div>
    {/if}
  </div>
</div>

<style>
  .body {
    padding: 30px;
  }

  h5 {
    margin: 0 0 24px 0;
  }

  .user {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .avatar {
    border-radius: 100%;
    height: 96px;
    overflow: hidden;
    width: 96px;
  }

  .avatar img {
    width: 100%;
  }

  .sharing {
    margin-top: 24px;
  }

  .sharing div {
    color: var(--secondary-color);
    margin-bottom: 24px;
    text-align: center;
  }

  .display-name {
    padding: 24px 0;
  }

  .anonymous {
    color: var(--secondary-color);
    line-height: 24px;
    text-align: center;
    width: 100%;
  }

  .anonymous :global(button) {
    margin: 24px 0;
  }

  .anonymous div {
    margin: 24px 0;
  }

  #settings :global(.card label) {
    margin-top: 24px;
    width: 100%;
  }

  .buttons {
    width: 100%;
  }

  .buttons > :global(*) {
    display: flex;
    margin-bottom: 24px;
    width: 100%;
  }

  .warning {
    color: var(--warning-color);
  }
</style>
