<script lang="ts">
  import ScrollShadow from '../utils/ScrollShadow.svelte'
  import ModalHeader from './ModalHeader.svelte'

  export let open = false

  export let heading = 'Heading'

  export let scrimWillClose = true

  export let onDismiss = () => {}

  function close() {
    open = false
    onDismiss()
  }

  $: if (open) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')
  }
</script>

<div class="bottom-sheet" class:open>
  <div
    class="scrim"
    on:click={scrimWillClose ? close : () => {}}
    on:scroll={(e) => e.stopPropagation()}
  />
  <div class="content">
    <ModalHeader onClickDismiss={close}>
      <slot name="heading" />{heading}
    </ModalHeader>
    <ScrollShadow>
      <div class="body">
        <slot />
      </div>
    </ScrollShadow>
  </div>
</div>

<style>
  :global(body.bottomsheet-open) .scrim {
    pointer-events: all;
  }

  .bottom-sheet {
    bottom: 50px;
    left: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 4;
    -webkit-overflow-scrolling: touch;
  }

  .bottom-sheet.open .scrim {
    opacity: 1;
  }

  .bottom-sheet.open .content {
    opacity: 1;
    transform: translateY(0);
  }

  .scrim {
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: 0.2s all;
    width: 100%;
    will-change: opacity;
  }

  .content {
    background: var(--bottomsheet-background-color);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    box-sizing: border-box;
    height: 75%;
    left: 0;
    display: flex;
    flex-direction: column;
    opacity: 0.5;
    pointer-events: all;
    position: relative;
    transform: translateY(100%);
    transition: 0.3s all;
    top: 25%;
    width: 100%;
    will-change: opacity, transform;
  }

  .body {
    flex: 1 1 auto;
    padding: 0 30px 30px 30px;
    overflow-y: scroll;
  }
</style>
