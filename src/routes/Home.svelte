<script lang="ts">
  import GoogleSignIn from '../components/buttons/GoogleSignIn.svelte'
  import Spinner from '../components/utils/Spinner.svelte'
  import { checkedSignIn, login, user } from '../firebase'

  export let location = ''
</script>

<div class="home">
  {#if $checkedSignIn === false}
    <Spinner />
  {:else if !$user}
    <GoogleSignIn on:click={login} />
  {/if}
</div>

<style>
  .home {
    padding: 30px;
  }
</style>
