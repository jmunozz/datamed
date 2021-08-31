// Fix Dash unability to render hash url properly
window.addEventListener("load", (event) => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      window.location = window.location;
    }, 1500);
  }
});


// On callback scroll to the top of the window
window.dash_clientside = Object.assign({}, window.dash_clientside, {
  search_updated: {
    scrollTop: (children) => {
      window.scroll(0, 0)
    }
  }
})


