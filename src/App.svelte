<script lang="ts">
  import { onMount } from 'svelte'
  import { Route, Router } from 'svelte-navigator'
  import AuthError from './components/layouts/AuthError.svelte'
  import Layout from './components/layouts/Layout.svelte'
  import ReloadPrompt from './components/layouts/ReloadPrompt.svelte'
  import { settings, user } from './firebase'
  import Login from './routes/Login.svelte'
  import Meals from './routes/Meals.svelte'
  import PageNotFound from './routes/PageNotFound.svelte'
  import Pantry from './routes/Pantry.svelte'
  import Recipe from './routes/Recipe.svelte'
  import RecipeEdit from './routes/RecipeEdit.svelte'
  import Recipes from './routes/Recipes.svelte'
  import Settings from './routes/Settings.svelte'
  import SettingsShare from './routes/SettingsShare.svelte'
  import ShoppingList from './routes/ShoppingList.svelte'
  import ShoppingLists from './routes/ShoppingLists.svelte'

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

  settings.subscribe((s) => {
    if (s.darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  })
</script>

<Router primary={false}>
  {#if $user}
    <Layout>
      <Route path="/" component={Meals} />
      <Route path="shopping-lists" component={ShoppingLists} />
      <Route path="shopping-lists/:id" component={ShoppingList} />
      <Route path="recipes" component={Recipes} />
      <Route path="recipes/:id" component={Recipe} />
      <Route path="recipes/:id/edit" component={RecipeEdit} />
      <Route path="recipes/create" component={RecipeEdit} />
      <Route path="pantry" component={Pantry} />
      <Route path="settings" component={Settings} />
      <Route path="settings/share" component={SettingsShare} />
      <Route component={PageNotFound} />
    </Layout>
  {:else}
    <Route component={Login} />
  {/if}
</Router>

<AuthError />

<ReloadPrompt />

<style>
  :global(body) {
    --background-color: rgb(245, 245, 245);
    --body-color: rgb(51, 51, 51);
    --border-color-disabled: rgb(225, 225, 225);
    --border-color: rgb(188, 188, 188);
    --bottomsheet-background-color: rgb(245, 245, 245);
    --button-font-size: 24px;
    --button-height: 48px;
    --card-color: rgb(255, 255, 255);
    --header-border-color: rgb(188, 188, 188);
    --input-border-width: 2px;
    --input-font-size: 20px;
    --input-height: 44px;
    --input-placeholder-color: rgb(188, 188, 188);
    --item-highlight-color: rgb(235, 235, 235);
    --nav-height: calc(50px + env(safe-area-inset-bottom, 0));
    --navigation-background-color: rgb(240, 240, 240);
    --navigation-border-color: rgb(220, 220, 220);
    --primary-color-light: rgb(182, 236, 182);
    --primary-color-light2: rgb(211, 243, 211);
    --primary-color: rgb(76, 214, 76);
    --signin-background-color: rgb(255, 255, 255);
    --signin-border-color: transparent;
    --scrim-background-color: rgba(0, 0, 0, 0.5);
    --secondary-color-light: rgb(231, 231, 231);
    --secondary-color-light2: rgb(245, 245, 245);
    --secondary-color: rgb(170, 170, 170);
    --textarea-height: 128px;
    --warning-color-light: rgb(255, 235, 235);
    --warning-color: rgb(219, 74, 55);
  }

  :global(body.dark-mode) {
    --background-color: rgb(15, 15, 15);
    --body-color: rgb(245, 245, 245);
    --border-color-disabled: rgb(40, 40, 40);
    --border-color: rgb(245, 245, 245);
    --bottomsheet-background-color: rgb(35, 35, 35);
    --card-color: rgb(25, 25, 25);
    --header-border-color: rgb(30, 30, 30);
    --item-highlight-color: rgb(40, 40, 40);
    --navigation-background-color: rgb(35, 35, 35);
    --navigation-border-color: rgb(25, 25, 25);
    --primary-color-light2: rgb(20, 20, 20);
    --signin-border-color: rgb(245, 245, 245);
    --scrim-background-color: rgba(255, 255, 255, 0.5);
    --secondary-color-light: rgb(30, 30, 30);
    --secondary-color-light2: rgb(20, 20, 20);
    --secondary-color: rgb(90, 90, 90);
  }

  :global(body) {
    background: var(--background-color);
    color: var(--body-color);
    touch-action: none;
  }

  :global(button) {
    touch-action: manipulation;
  }
</style>
