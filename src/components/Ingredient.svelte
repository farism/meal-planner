<script lang="ts">
  import { getDoc } from '../firebase'
  import type { Ingredient } from '../types'

  export let location = ''
  export let id: string

  $: doc = getDoc<Ingredient>(`ingredients/${id}`)
</script>

<h1>Ingredient</h1>

{$doc?.name}

<style>
</style>
