<script lang="ts">
  import { onMount } from 'svelte'

  export let query: string

  let mql: MediaQueryList
  let matches = false

  function onChange(event: MediaQueryListEvent) {
    matches = mql.matches
  }

  onMount(() => {
    mql = window.matchMedia(query)
    matches = mql.matches
    mql.addEventListener('change', onChange)

    return () => {
      mql.removeEventListener('change', onChange)
    }
  })

  function addListener() {}

  function removeListener() {}
</script>

<slot {matches} />
