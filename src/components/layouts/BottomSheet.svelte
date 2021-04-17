<script lang="ts">
  import X from 'svelte-feather-icons/src/icons/XIcon.svelte'
  import ScrollShadow from '../utils/ScrollShadow.svelte'

  export let open = false
  export let heading = 'Heading'
  export let onClickDismiss = () => {}

  $: if (open) {
    document.body.classList.add('bottomsheet-open')
  } else {
    document.body.classList.remove('bottomsheet-open')
  }
</script>

<div class="bottom-sheet" class:open>
  <div class="scrim" on:scroll={(e) => e.stopPropagation()} />
  <div class="content">
    <div class="header">
      <h2>{heading}</h2>
      <button class="dismiss" on:click={onClickDismiss}>
        <X size="24" />
      </button>
    </div>
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
    background: white;
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

  .header {
    display: flex;
    flex: 0 0 auto;
    padding: 30px;
  }

  .header h2 {
    flex: 1 1 auto;
    margin: 0;
  }

  .header .dismiss {
    align-items: center;
    background: none;
    border: none;
    display: flex;
    flex: 0 0 auto;
    height: 32px;
    justify-content: center;
    outline: none;
    margin-left: 12px;
    padding: 0;
    width: 32px;
  }

  .body {
    flex: 1 1 auto;
    padding: 0 30px 30px 30px;
    overflow-y: scroll;
  }
</style>
