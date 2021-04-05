<script lang="ts">
  import { user } from '../firebase'
  import NavigationLink from './NavigationLink.svelte'

  $: name = $user?.displayName?.split(' ') ?? []

  $: initials = (name[0]?.[0] ?? '') + (name[1]?.[0] ?? '')
</script>

<nav>
  <NavigationLink to="/">Home</NavigationLink>
  <NavigationLink to="/recipes">Recipes</NavigationLink>
  <NavigationLink to="/ingredients">Ingredients</NavigationLink>
  <NavigationLink to="/shopping-list">Shopping List</NavigationLink>
  <NavigationLink to="/meal-plans">Meal Plans</NavigationLink>
  {#if $user}
    <div class="avatar">
      {$user.displayName}
    </div>
  {/if}
</nav>

<style>
  nav {
    align-items: center;
    background: #eee;
    display: flex;
    height: 100%;
    justify-content: flex-end;
  }

  .avatar {
    padding: 0 12px;
  }
</style>
