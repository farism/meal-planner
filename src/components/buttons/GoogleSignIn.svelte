<button on:click>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 48 48"
  >
    <defs>
      <path
        id="a"
        d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
      />
    </defs>
    <clipPath id="b">
      <use xlink:href="#a" overflow="visible" />
    </clipPath>
    <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
    <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
    <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
    <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
  </svg>
  <span>Sign in with Google</span>
</button>

<style>
  button {
    align-items: center;
    background-color: var(--signin-background-color);
    border: 1px solid var(--signin-border-color);
    border-radius: 2px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    color: rgb(70, 70, 70);
    display: flex;
    justify-content: center;
    padding: 12px;
    width: 100%;
  }

  button:active {
    background: var(--secondary-color-light);
  }

  svg {
    height: 32px;
    margin-right: 32px;
    width: 32px;
  }

  span {
    font-size: 24px;
  }
</style>
