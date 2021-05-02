<script lang="ts">
  import type { NavigateFn } from 'svelte-navigator'
  import AnonymousSignIn from '../components/buttons/AnonymousSignIn.svelte'
  import GoogleSignIn from '../components/buttons/GoogleSignIn.svelte'
  import Spinner from '../components/utils/Spinner.svelte'
  import { checkedSignIn, login, loginAnonymous, user } from '../firebase'

  export let location = ''

  export let navigate: NavigateFn
</script>

<div class="login">
  {#if $checkedSignIn === false}
    <Spinner />
  {:else if !$user}
    <GoogleSignIn on:click={login} />
    <div class="or">or</div>
    <AnonymousSignIn on:click={loginAnonymous} />
  {/if}
</div>

<style>
  .login {
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  }

  .or {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
</style>
