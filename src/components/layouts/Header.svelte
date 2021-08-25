<script lang="ts">
  export let heading: string = ''
  export let dynamicSize: boolean = false

  function fontSize(str: string) {
    if (dynamicSize) {
      return ''
    }

    if (str.length < 15) {
      return 'lg'
    } else if (str.length < 25) {
      return 'md'
    } else {
      return 'sm'
    }
  }
</script>

<div class="header {fontSize(heading)}">
  <h1>
    <div>
      {heading}
      <slot />
    </div>
  </h1>
</div>

<style>
  .header {
    border-bottom: 1px solid var(--header-border-color);
    box-sizing: border-box;
    padding: 12px 24px;
    position: relative;
    width: 100%;
  }

  .header.lg h1 {
    font-size: 2em;
  }

  .header.md h1 {
    font-size: 1.5em;
  }

  .header.sm h1 {
    font-size: 1em;
  }

  h1 {
    align-items: center;
    display: flex;
    height: 39px;
    justify-content: center;
    margin: 0;
    width: 100%;
  }

  h1 > :global(*) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
