<div class="container">
  <div class="spinner" />
</div>

<style>
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.75;
  }

  .spinner {
    position: relative;
    font-size: 64px;
  }

  .spinner:before,
  .spinner:after {
    content: '';
    position: relative;
    display: block;
  }

  .spinner:before {
    animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
    width: 1em;
    height: 1em;
    background-color: var(--primary-color);
  }

  .spinner:after {
    animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
    bottom: -20px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
  }

  @keyframes spinner {
    50% {
      border-radius: 50%;
      transform: scale(0.5) rotate(360deg);
    }
    100% {
      transform: scale(1) rotate(720deg);
    }
  }

  @keyframes shadow {
    50% {
      transform: scale(0.5);
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
</style>
