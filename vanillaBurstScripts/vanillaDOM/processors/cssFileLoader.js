ë.frozenVanilla("cssFileLoader", function (cssPath) {
  // Define the paths for the default CSS file and the CSS file specified by cssPath
  const cssPaths = [ë.domainUrl + baseUrl + "style.css", cssPath];

  // Load each CSS file
  cssPaths.forEach((path) => {
    if (path) {
      let linkTag = document.head.querySelector(
        `link[data-css-path="${path}"]`
      );
      if (!linkTag) {
        const nonceString = ë.nonceBack();

        linkTag = document.createElement("link");
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("href", path);
        linkTag.setAttribute("data-css-path", path);
        linkTag.setAttribute("nonce", nonceString);
        linkTag.setAttribute("type", "text/css");
        document.head.appendChild(linkTag);
      }
    }
  });
});
