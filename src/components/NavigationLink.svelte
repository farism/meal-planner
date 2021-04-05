<script lang="ts">
  import { Link } from 'svelte-routing'
  import type { GetPropsParams } from 'svelte-routing'

  export let to: string = ''

  function getProps({
    location,
    href,
    isPartiallyCurrent,
    isCurrent,
  }: GetPropsParams) {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent

    const active = isActive ? ' active' : ''

    return {
      class: `navigation-link${active}`,
    }
  }
</script>

<Link {to} {getProps}>
  <span class="label">
    <slot />
  </span>
</Link>

<style>
  :global(.navigation-link) {
    align-items: center;
    color: #222;
    display: inline-flex;
    height: 100%;
    justify-content: center;
    padding: 0 16px;
    text-decoration: none;
    transition: 0.2s all;
  }

  :global(.navigation-link.active) {
    background: #ccc;
  }
</style>
