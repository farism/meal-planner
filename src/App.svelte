<script lang="ts">
  import { onMount } from 'svelte'
  import { Route, Router } from 'svelte-navigator'
  import AuthError from './components/layouts/AuthError.svelte'
  import Layout from './components/layouts/Layout.svelte'
  import { authError, user } from './firebase'
  import Login from './routes/Login.svelte'
  import Meals from './routes/Meals.svelte'
  import Pantry from './routes/Pantry.svelte'
  import Recipe from './routes/Recipe.svelte'
  import RecipeEdit from './routes/RecipeEdit.svelte'
  import Recipes from './routes/Recipes.svelte'
  import Settings from './routes/Settings.svelte'
  import SettingsShare from './routes/SettingsShare.svelte'
  import Shopping from './routes/Shopping.svelte'

  $: showAuthError = $authError !== ''

  onMount(() => {
    document.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 1) {
          e.preventDefault()
        }
      },
      {
        passive: false,
      }
    )
  })
</script>

<Router primary={false}>
  {#if $user}
    <Layout>
      <Route component={Meals} />
      <Route path="shopping" component={Shopping} />
      <Route path="recipes" component={Recipes} />
      <Route path="recipes/:id" component={Recipe} />
      <Route path="recipes/:id/edit" component={RecipeEdit} />
      <Route path="recipes/create" component={RecipeEdit} />
      <Route path="pantry" component={Pantry} />
      <Route path="settings" component={Settings} />
      <Route path="settings/share" component={SettingsShare} />
    </Layout>
  {:else}
    <Route component={Login} />
  {/if}
</Router>

<AuthError />

<style>
  :global(:root) {
    --nav-height: calc(50px + env(safe-area-inset-bottom, 0));
    --button-font-size: 24px;
    --button-height: 48px;
    --input-border-width: 2px;
    --input-font-size: 20px;
    --input-height: 44px;
    --input-placeholder-color: rgb(188, 188, 188);
    --textarea-height: 128px;
    --item-highlight-color: rgb(235, 235, 235);
    --border-color: rgb(188, 188, 188);
    --border-color-disabled: rgb(225, 225, 225);
    --body-color: rgb(51, 51, 51);
    --primary-color: rgb(76, 214, 76);
    --primary-color-light: rgb(182, 236, 182);
    --primary-color-light2: rgb(211, 243, 211);
    --secondary-color: rgb(170, 170, 170);
    --secondary-color-light: rgb(231, 231, 231);
    --secondary-color-light2: rgb(245, 245, 245);
    --warning-color: rgb(219, 74, 55);
    --warning-color-light: rgb(255, 235, 235);
  }

  :global(body) {
    touch-action: none;
  }

  :global(button) {
    touch-action: manipulation;
  }
</style>
