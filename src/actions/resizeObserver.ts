export function resizeObserver(
  node: HTMLElement,
  callback: (node: Element) => void
) {
  const observer = new ResizeObserver((entries) => {
    entries.forEach((e) => callback(e.target))
  })

  observer.observe(node)

  return {
    destroy() {
      observer.disconnect()
    },
  }
}
