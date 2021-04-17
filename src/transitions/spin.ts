import { elasticOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/types/runtime/transition'

interface SpinParams {
  delay?: number
  duration?: number
}

export function spin(
  node: HTMLElement,
  { delay = 0, duration = 200 }: SpinParams = {}
): TransitionConfig {
  return {
    duration,
    delay,
    css: (t: number) => {
      return `
        opacity: ${t};
        transform: rotate(${t * 180}deg);
      `
    },
  }
}
