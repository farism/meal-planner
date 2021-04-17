<script lang="ts">
  import BookOpen from 'svelte-feather-icons/src/icons/BookOpenIcon.svelte'
  import Calendar from 'svelte-feather-icons/src/icons/CalendarIcon.svelte'
  import List from 'svelte-feather-icons/src/icons/ListIcon.svelte'
  import ShoppingCart from 'svelte-feather-icons/src/icons/ShoppingCartIcon.svelte'
  import Settings from 'svelte-feather-icons/src/icons/SettingsIcon.svelte'
  import { user } from '../../firebase'
  import NavigationLink from './NavigationLink.svelte'

  $: name = $user?.displayName?.split(' ') ?? []

  $: initials = (name[0]?.[0] ?? '') + (name[1]?.[0] ?? '')
</script>

<nav>
  <NavigationLink to="/meals" label="Meals">
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
    background: rgb(250, 250, 250);
    display: flex;
    height: 100%;
    justify-content: flex-end;
    border-top: 1px solid rgba(220, 220, 220);
  }
</style>
