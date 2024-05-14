///You should try frozenVanilla! it's awesome

// Centralized nonce management
function getNonce() {
  let nonceString = window.nonce();
  window.nonceBack(nonceString);
  return nonceString;
}

////for this consider making window.schema available to helper functions as a localstorage object instead, so a dev doesn't have to keep passing all this info, or change this (which i don't want to because too much reconfiguring in singlePromise.js for now)
window.frozenVanilla(
  "loadDOM",
  async function (
    config,
    domFunction,
    originFunction,
    renderSchema,
    originBurst,
    initView
  ) {
    return new Promise(async (resolve, reject) => {
      const functionHTML = await window.loadParts(
        config,
        domFunction,
        originFunction,
        initView,
        renderSchema,
        originBurst
      );

      if (functionHTML !== null) {
        resolve(functionHTML);
      } else {
        reject(new Error("functionHTML is falsy"));
      }
    })
      .then()
      .catch((error) => {
        console.error(error);
      });
  }
);

window.frozenVanilla(
  "loadParts",
  function (
    domConfig,
    domFunction,
    originFunction,
    initView,
    renderSchema,
    originBurst
  ) {
    let functionFile, htmlPath, cssPath, container, passedFunction;

    // Determine the function to use
    passedFunction =
      renderSchema.customFunctions?.[domFunction] ?? domConfig[domFunction];

    if (passedFunction.functionFile) {
      functionFile = passedFunction.functionFile;
      htmlPath = window.baseUrl + passedFunction.htmlPath;
      if (passedFunction.cssPath) {
        cssPath = window.baseUrl + passedFunction.cssPath;
      } else {
        cssPath = null;
      }

      container = passedFunction.container;
    } else {
      console.error("Function file not found");
      return;
    }

    let targetElement = document.getElementById(container);
    continueDOM(htmlPath, cssPath, container);

    // Function to continue DOM processing
    function continueDOM(htmlPath, cssPath, container, originBurst) {
      return new Promise((resolve, reject) => {
        let originBurst;

        try {
          originBurst = JSON.parse(localStorage.getItem("originBurst"));
        } catch (error) {
          console.error("Error parsing originBurst from localStorage:", error);
          originBurst = {};
        }
        let htmlResult =
          originBurst?.[originFunction]?.[functionFile]?.htmlResult;

        if (htmlResult) {
          let targetElement =
            document.getElementById(container) ||
            document.querySelector(`div#${container}`);

          if (!targetElement) {
            targetElement = document.createElement("div");
            let nonceString = window.nonce();
            console.log("nonceString:", nonceString); // Check nonceString
            window.nonceBack(nonceString);
            targetElement.setAttribute("nonce", nonceString);
            console.log("document.body:", document.body); // Check document.body
            document.body.appendChild(targetElement);
          }

          console.log("htmlResult:", htmlResult); // Check htmlResult

          // Parse the HTML string into a DOM structure
          let parser = new DOMParser();
          let doc = parser.parseFromString(htmlResult, "text/html");

          // Add a nonce to img tags
          let imgTags = doc.getElementsByTagName("img");
          for (let img of imgTags) {
            let nonceString = window.nonce();
            window.nonceBack(nonceString);
            img.setAttribute("nonce", nonceString);
          }

          // Serialize the DOM structure back into a string
          let serializer = new XMLSerializer();
          let serializedHTML = serializer.serializeToString(doc);

          // Set the innerHTML of the target element
          targetElement.innerHTML = serializedHTML;

          let signalDOMUpdate = window.signalBurstDOM(
            originFunction,
            functionFile
          );
          // Cache the result
          if (signalDOMUpdate === true) {
            if (functionFile && functionFile !== undefined) {
              functionHTML = window.sanitizeVanillaDOM(
                targetElement.innerHTML,
                functionFile
              );
              window.storeBurstOrigin(
                originBurst,
                originFunction,
                functionFile,
                functionHTML
              );
            }
          }

          window.cssFileLoader(cssPath);
        } else {
          window.htmlFileLoader({ htmlPath, cssPath }, (htmlContent) => {
            // Sanitize the HTML content
            let targetElement =
              document.getElementById(container) ||
              document.querySelector(`div#${container}`);
            let functionHTML;

            if (!targetElement) {
              targetElement = document.createElement("div");
              targetElement.id = container;
              let nonceString = window.nonce();
              window.nonceBack(nonceString);
              targetElement.setAttribute("nonce", nonceString);
              document.body.appendChild(targetElement);
            }

            if (functionFile) {
              functionHTML = window.sanitizeVanillaDOM(
                htmlContent,
                functionFile
              );
            }

            if (functionHTML) {
              targetElement.innerHTML = functionHTML;
            }

            window.cssFileLoader(cssPath);
            let signalDOMUpdate = window.signalBurstDOM(
              originFunction,
              functionFile
            );
            // Cache the result
            window.storeBurstOrigin(
              originBurst,
              originFunction,
              functionFile,
              functionHTML
            );
            if (functionFile && functionFile !== undefined) {
              if (signalDOMUpdate === true) {
                functionHTML = window.sanitizeVanillaDOM(
                  targetElement.innerHTML,
                  functionFile
                );
                window.storeBurstOrigin(
                  originBurst,
                  originFunction,
                  functionFile,
                  functionHTML
                );

                resolve(functionHTML);
              } else {
                resolve(functionHTML);
              }
            }
            // Resolve the Promise
          });
        }
      });
    }
  }
);
