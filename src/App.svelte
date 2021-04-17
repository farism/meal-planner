<script lang="ts">
  import { onMount } from 'svelte'
  import { Route, Router } from 'svelte-routing'
  import Layout from './components/layouts/Layout.svelte'
  import { user } from './firebase'
  import Home from './routes/Home.svelte'
  import Meals from './routes/Meals.svelte'
  import Pantry from './routes/Pantry.svelte'
  import Recipes from './routes/Recipes.svelte'
  import Recipe from './routes/Recipe.svelte'
  import Settings from './routes/Settings.svelte'
  import Shopping from './routes/Shopping.svelte'

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

<Router>
  {#if $user}
    <Layout>
      <Route path="meals" component={Meals} />
      <Route path="shopping" component={Shopping} />
      <Route path="recipes" component={Recipes} />
      <Route path="recipes/:id" component={Recipe} />
      <Route path="pantry" component={Pantry} />
      <Route path="settings" component={Settings} />
    </Layout>
  {:else}
    <Route component={Home} />
  {/if}
</Router>

<style>
  :global(:root) {
    --button-font-size: 24px;
    --button-height: 48px;

    --input-border-width: 2px;
    --input-font-size: 20px;
    --input-height: 44px;
    --input-placeholder-color: rgb(188, 188, 188);

    --textarea-height: 128px;

    --item-highlight-color: rgb(238, 238, 238);

    --border-color: rgb(188, 188, 188);

    --body-color: rgb(51, 51, 51);
    --primary-color: rgb(76, 214, 76);
    --primary-color-light: rgb(182, 236, 182);
    --secondary-color: rgb(170, 170, 170);
    --secondary-color-light: rgb(231, 231, 231);
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
