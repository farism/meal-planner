<script lang="ts">
  import { Link, useResolve } from 'svelte-navigator'

  export let to: string = ''

  export let label: string = ''

  const resolve = useResolve()

  function getProps({ location, href }: any) {
    const exact = resolve(location.pathname) === href

    const partialMatch = resolve(location.pathname).includes(href)

    const isActive = href === '/meal-planner' ? exact : exact || partialMatch

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
    color: var(--body-color);
    display: inline-flex;
    flex-direction: column;
    flex: 1 1 0;
    font-size: 12px;
    height: 100%;
    justify-content: center;
    padding: 0 16px;
    text-decoration: none;
    transition: 0.2s all;
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
