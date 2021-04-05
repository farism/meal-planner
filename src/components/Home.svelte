<script lang="ts">
  import { auth, isCheckingLoggedIn, provider, user } from '../firebase'

  export let location = ''

  function login() {
    auth.signInWithPopup(provider)
  }

  function logout() {
    auth.signOut()
  }
</script>

<div>
  {#if $isCheckingLoggedIn}
    ...
  {:else if $user}
    Welcome, {$user.displayName}
    <button on:click={logout}>sign out</button>
  {:else}
    <button on:click={login}>sign in</button>
  {/if}
</div>
