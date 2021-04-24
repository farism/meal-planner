<script lang="ts">
  import { Link } from 'svelte-navigator'

  export let to: string = ''
  export let label: string = ''

  function getProps({ location, href, isPartiallyCurrent, isCurrent }: any) {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent

    const className = `navigation-link ${isActive ? 'active' : ''}`

    return {
      class: className,
    }
  }
</script>

<Link {to} {getProps}>
  <span class="icon">
    <slot />
  </span>
  <span class="label">
    {label}
  </span>
</Link>

<style>
  :global(.navigation-link) {
    align-items: center;
    color: #222;
    display: inline-flex;
    flex-direction: column;
    flex: 1 1 0;
    height: 100%;
    justify-content: center;
    padding: 0 16px;
    text-decoration: none;
    transition: 0.2s all;
    font-size: 12px;
  }

  :global(.navigation-link.active) {
    color: #38bf38;
  }

  :global(.navigation-link .icon) {
    display: flex;
    margin-bottom: 4px;
  }

  :global(.navigation-link .label) {
    display: flex;
  }
</style>
