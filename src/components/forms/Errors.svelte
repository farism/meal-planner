<script lang="ts">
  export let errors: string[] = []
</script>

<ul>
  {#each errors as error}
    <li>{error}</li>
  {/each}
</ul>

<style>
  ul {
    background-color: var(--warning-color-light);
    border: 1px solid var(--warning-color);
    border-radius: 4px;
    list-style: none;
    margin: 0 0 24px 0;
    padding: 12px 16px;
  }

  li {
    color: var(--warning-color);
  }
</style>
