// Fix Dash unability to render hash url properly
window.addEventListener("load", (event) => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      window.location = window.location;
    }, 1500);
  }
});


// FrontPage

// This will scroll to next section when mouse appendice is clicked
document.addEventListener('DOMContentLoaded', function() {
  const isFrontPage = window.location.pathname === "/";
  if (isFrontPage) {
    setTimeout(() => {
      const mouseAppendiceElement =  document.getElementsByClassName("FrontPageSectionAppendice")[0]
      const nextSectionElement = document.getElementsByClassName("FrontPageSection2")[0]
      if (mouseAppendiceElement && nextSectionElement) {
        mouseAppendiceElement.addEventListener("click", function() {
          nextSectionElement.scrollIntoView({ behavior: "smooth" });
        }, false)
      }
    }, 1500)
  }
}, false)


// On callback scroll to the top of the window
window.dash_clientside = Object.assign({}, window.dash_clientside, {
  search_updated: {
    scrollTop: (children) => {
      window.scroll(0, 0)
    }
  }
})



