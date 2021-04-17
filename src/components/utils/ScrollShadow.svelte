<script lang="ts">
  import { resizeObserver } from '../../actions/resizeObserver'

  export let isTopLevel = false

  export let shadowSize = 30

  let ref: HTMLElement

  let offset = 0

  $: blur = Math.min(offset, shadowSize)

  $: alpha = Math.min((blur / shadowSize) * 0.25)

  $: style =
    blur > 0
      ? `box-shadow: inset 0 -${blur}px ${blur}px -${blur}px rgba(0, 0, 0, ${alpha});`
      : ''

  function onBodyScroll() {
    offset = ref?.scrollHeight - ref?.clientHeight - ref?.scrollTop
  }

  function onResize() {
    onBodyScroll()
  }
</script>

<div class="container">
  <div class="scroll" bind:this={ref} on:scroll={onBodyScroll}>
    <div use:resizeObserver={onResize} style="padding-bottom: {shadowSize}px">
      <slot />
    </div>
  </div>
  <div class="shadow" class:top-level={isTopLevel} {style} />
</div>

<style>
  :global(body.bottomsheet-open) .shadow.top-level {
    box-shadow: none !important;
  }

  .container {
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .scroll {
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }

  .shadow {
    bottom: 0;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: box-shadow 0.1s ease-out;
  }
</style>
