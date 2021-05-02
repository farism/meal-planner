<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { get, readable } from 'svelte/store'
  import List from '../layouts/List.svelte'
  import Input from './Input.svelte'

  export let placeholder = ''
  export let value = ''
  export let name = ''
  export let docs: Readable<any[]> = readable([], () => {})
  export let ref: Input | null = null
  export let getValue = (item: any) => item.name!
  export let checkValid = (value: string) => Promise.resolve(true)

  let open = false

  let flip = false

  $: filtered = readable(
    get(docs).filter((doc) =>
      doc.name.trim().toLowerCase().startsWith(value.toLowerCase())
    ),
    () => {}
  )

  $: console.log($filtered)

  function show() {
    open = true
  }

  function hide() {
    value = value.trim()
    open = false
    flip = false

    if (value !== '') {
      checkValid(value).then((isValid) => {
        if (!isValid) {
          value = ''
        }
      })
    }
  }

  function onClick(e: MouseEvent) {
    ;(e.target as HTMLInputElement).select()

    show()
  }

  function onSelect(item: any) {
    value = getValue(item)

    hide()
  }

  function reposition(el: HTMLElement) {
    const rect = el.getBoundingClientRect()

    flip = rect.y + rect.height > window.innerHeight - 50
  }
</script>

<div class="autocomplete">
  <Input
    on:input={show}
    on:click={onClick}
    bind:this={ref}
    bind:value
    {name}
    {placeholder}
  />
  {#if open}
    <div class="scrim" on:click={hide} />
    <div class="menu" class:flip use:reposition>
      <List
        docs={filtered}
        onClick={onSelect}
        emptyMessage="No matching items"
      />
    </div>
  {/if}
</div>

<style>
  .autocomplete {
    position: relative;
    width: 100%;
  }

  .scrim {
    background: transparent;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 19;
  }

  .menu {
    background: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    max-height: 156px;
    overflow-y: scroll;
    overscroll-behavior: container;
    position: absolute;
    width: 100%;
    z-index: 20;
    outline: #f00;
  }

  .menu.flip {
    bottom: 44px;
  }
</style>
