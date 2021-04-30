<script lang="ts">
  import BookOpen from 'svelte-feather-icons/src/icons/BookOpenIcon.svelte'
  import Calendar from 'svelte-feather-icons/src/icons/CalendarIcon.svelte'
  import List from 'svelte-feather-icons/src/icons/ListIcon.svelte'
  import Settings from 'svelte-feather-icons/src/icons/SettingsIcon.svelte'
  import ShoppingCart from 'svelte-feather-icons/src/icons/ShoppingCartIcon.svelte'
  import { user } from '../../firebase'
  import NavigationLink from './NavigationLink.svelte'

  $: name = $user?.displayName?.split(' ') ?? []
</script>

<nav>
  <NavigationLink to="/" label="Meals">
    <Calendar strokeWidth={1.5} size="18" />
  </NavigationLink>
  <NavigationLink to="/shopping" label="Shopping">
    <ShoppingCart strokeWidth={1.5} size="18" />
  </NavigationLink>
  <NavigationLink to="/recipes" label="Recipes">
    <BookOpen strokeWidth={1.5} size="18" />
  </NavigationLink>
  <NavigationLink to="/pantry" label="Pantry">
    <List strokeWidth={1.5} size="18" />
  </NavigationLink>
  <NavigationLink to="/settings" label="Settings">
    <Settings strokeWidth={1.5} size="18" />
  </NavigationLink>
</nav>

<style>
  nav {
    align-items: center;
    background: rgb(240, 240, 240);
    border-top: 1px solid rgba(220, 220, 220);
    box-sizing: border-box;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    padding-bottom: calc(env(safe-area-inset-bottom, 0) / 2);
  }
</style>
