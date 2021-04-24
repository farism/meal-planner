<script lang="ts">
  import { Link } from 'svelte-navigator'
  import Button from '../components/buttons/Button.svelte'
  import Header from '../components/layouts/Header.svelte'
  import { logout, user } from '../firebase'

  export let location = ''
</script>

<div class="wrapper">
  <div class="content">
    <Header>
      <div>Settings</div>
    </Header>
    <div class="body">
      {#if $user}
        <div class="user">
          {#if $user?.photoURL}
            <div class="avatar">
              <img src={$user.photoURL} alt="User Photo" />
            </div>
          {/if}
          <div class="name">
            {$user.displayName}
          </div>
          <div class="buttons">
            <Link to="/settings/share">
              <Button secondary>Account Sharing</Button>
            </Link>
            <Button warning on:click={logout}>Sign out</Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .wrapper {
    overflow-x: hidden;
  }

  .content {
    transition: 0.2s all ease-out;
  }

  .body {
    padding: 30px 60px;
  }

  h4 {
    text-align: center;
  }

  .user {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .avatar {
    border-radius: 100%;
    overflow: hidden;
    width: 96px;
    height: 96px;
  }

  .name {
    padding: 24px 0;
  }

  .buttons {
    width: 100%;
  }

  .buttons > :global(*) {
    display: flex;
    margin-bottom: 24px;
  }
</style>
