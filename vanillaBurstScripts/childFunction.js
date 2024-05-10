window.frozenVanilla(
  "childFunction",
  async function (renderSchema, rollCall, runRoll, originBurst) {
    return new Promise((resolve, reject) => {
      let vanillaPromise;
      if (runRoll === true) {
        let runFunction;
        rollCall;
        let serverResult;

        // for (const element of rollCall) {
        //   if (window[element] && typeof window[element] === "function") {
        //     delete window[element];
        //   }
        // }

        if (Array.isArray(rollCall) && rollCall.length >= 0) {
          arrayRoll(rollCall);
        }

        async function arrayRoll(rollCall) {
          let maxCount = rollCall.length;
          let count = 0;

          for (const element of rollCall) {
            count++;
            let passedFunction = renderSchema.customFunctions[element];
            let customFunctionName = passedFunction.functionFile;

            try {
              let originBurst = await processFunction(
                passedFunction,
                customFunctionName
              );
              let serverResult =
                originBurst?.[renderSchema.landing]?.[customFunctionName] ||
                null;

              let vanillaPromise = await window.singlePromise(
                renderSchema,
                serverResult,
                passedFunction,
                originBurst
              );

              let id = passedFunction.container;

              console.log("customFunctionName:", customFunctionName);
              console.log(
                "window[customFunctionName]:",
                window[customFunctionName]
              );

              let observer = new MutationObserver((mutationsList, observer) => {
                let componentElement = document.getElementById(id);

                if (componentElement && customFunctionName === render) {
                  window[customFunctionName](vanillaPromise);
                  window.storeBurst(vanillaPromise);
                  observer.disconnect();
                }
              });
              window[customFunctionName](vanillaPromise);

              observer.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true,
              });

              if (count >= maxCount) {
                return vanillaPromise;
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
        async function processFunction(
          passedFunction,
          customFunctionName,
          data,
          runData
        ) {
          return new Promise((resolve, reject) => {
            console.info({
              Status: "STARTING rollCall for customFunction ",
              customFunctionName,
              passedFunction,
            });
            console.table(passedFunction);
            if (passedFunction) {
              //passedFunction.render = "burst";

              originBurst = window.updateOriginBurst(
                renderSchema,
                customFunctionName,
                passedFunction,
                originBurst
              );

              let serverResult;
              if (
                passedFunction.dataSchema &&
                passedFunction.dataSchema.data.auto &&
                passedFunction.dataSchema.data.auto === true
              ) {
                serverResult = window.serverRender(
                  passedFunction.dataSchema,
                  "serverBurst"
                );
              }
              originBurst = window.setOriginBurst(
                renderSchema,
                customFunctionName,
                passedFunction,
                originBurst,
                serverResult
              );
              resolve(originBurst);
            }
          })
            .then()
            .catch((error) => {
              throw new Error("something went wrong" + error);
            });
        }
      }

      return true;
    });
  }
);
window.frozenVanilla("reRollFunctions", function (rollCall) {
  function runReRoll(customFunctionName) {
    if (typeof window[customFunctionName] === "function") {
      window[customFunctionName]();
    }
  }
  if (Array.isArray(rollCall) && rollCall.length > 1) {
    for (const customFunctionName of rollCall) {
      runReRoll(customFunctionName);
    }
  } else {
    runReRoll(customFunctionName);
  }
});
