<script lang="ts">
  import Spinner from '../components/utils/Spinner.svelte'
  import { auth, signedIn, provider, user } from '../firebase'

  export let location = ''

  function login() {
    auth.signInWithRedirect(provider)
  }

  function logout() {
    auth.signOut()
  }
</script>

<div>
  {#if $signedIn === null}
    <Spinner />
  {:else if $user}
    Welcome, {$user.displayName}
    <button on:click={logout}>sign out</button>
  {:else}
    <button on:click={login}>sign in</button>
  {/if}
</div>
