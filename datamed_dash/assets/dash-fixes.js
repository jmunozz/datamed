// Fix Dash unability to render hash url properly
window.addEventListener("load", (event) => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      window.location = window.location;
    }, 1500);
  }
});
