<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './Home.svelte'
  import Ingredient from './Ingredient.svelte'
  import Ingredients from './Ingredients.svelte'
  import Layout from './Layout.svelte'
  import MealPlans from './MealPlans.svelte'
  import Recipe from './Recipe.svelte'
  import Recipes from './Recipes.svelte'
  import ShoppingList from './ShoppingList.svelte'

  export let url = ''
</script>

<Router {url}>
  <Layout>
    <Route path="/" component={Home} />
    <Route path="ingredients" component={Ingredients} />
    <Route path="ingredients/:id" component={Ingredient} />
    <Route path="recipes" component={Recipes} />
    <Route path="recipes/:id" component={Recipe} />
    <Route path="shopping-list" component={ShoppingList} />
    <Route path="meal-plans" component={MealPlans} />
  </Layout>
</Router>

<style>
</style>
