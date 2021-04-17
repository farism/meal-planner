import App from './App.svelte'

const target = document.getElementById('app')

if (target) {
  const app = new App({
    target,
  })
}
