<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import { Link } from 'svelte-navigator'
  import Button from '../components/buttons/Button.svelte'
  import Checkbox from '../components/forms/Checkbox.svelte'
  import RadioButton from '../components/forms/RadioButton.svelte'
  import Card from '../components/layouts/Card.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { logout, settings, user } from '../firebase'
  import type { Settings } from '../types'

  export let location = ''

  export let navigate: NavigateFn

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

<Header>
  <div>Settings</div>
</Header>

<div id="settings">
  <div class="body">
    {#if $user}
      <div class="user">
        {#if $user?.photoURL}
          <div class="avatar">
            <img src={$user.photoURL} alt="User Photo" />
          </div>
        {/if}
        <div class="name">
          {$user.displayName}
        </div>
        <Card>
          <h5>Default Meal View</h5>
          <RadioButton
            bind:group={$settings.mealView}
            on:change={onChangeDefaultMealView}
            value={0}
          >
            Calendar
          </RadioButton>
          <RadioButton
            bind:group={$settings.mealView}
            on:change={onChangeDefaultMealView}
            value={1}
          >
            Upcoming
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
        <div class="buttons">
          <Link to="/settings/share">
            <Button secondary>Account Sharing</Button>
          </Link>
          <Button warning on:click={logout}>Sign Out</Button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .body {
    padding: 30px;
  }

  .user {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .avatar {
    border-radius: 100%;
    overflow: hidden;
    width: 96px;
    height: 96px;
  }

  .avatar img {
    width: 100%;
  }

  .name {
    padding: 24px 0;
  }

  h5 {
    margin: 0;
  }

  #settings :global(.card label) {
    width: 100%;
    margin-top: 24px;
  }

  .buttons {
    margin-top: 24px;
    width: 100%;
  }

  .buttons > :global(*) {
    display: flex;
    margin-bottom: 24px;
    width: 100%;
  }
</style>
