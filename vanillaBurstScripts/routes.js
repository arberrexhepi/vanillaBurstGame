// Sets one route on the initial path and is not called again until a full page reload or AJAX re-rendering
ë.frozenVanilla("getRoute", function (param) {
  const path = ë.location.pathname;
  const searchParams = new URLSearchParams(ë.location.search);

  const burstRoute = searchParams.get("burst");
  const namespace = searchParams.get("name_space");
  const entry = searchParams.get("entry");
  const appRoutes = ë.frozenVanilla.get("registeredRoutes");

  function routeCheck(routeCheckArray) {
    if (burstRoute) {
      return burstRoute;
    }

    const pathSegments = path.split("/");
    const firstSegment = pathSegments[1] || "";

    for (const currentRoute of routeCheckArray) {
      if (path !== "/" && firstSegment === currentRoute) {
        return pathSegments[pathSegments.length - 1];
      } else if (path === "/" && burstRoute) {
        return burstRoute;
      } else if (
        firstSegment !== "" &&
        firstSegment !== currentRoute &&
        firstSegment !== burstRoute
      ) {
        return pathSegments[pathSegments.length - 2];
      } else if (firstSegment === "" && !burstRoute) {
        return currentRoute;
      } else if (path === "/" && !burstRoute) {
        return currentRoute;
      }
    }

    return null;
  }

  function routeCheckPath(routeCheckArray) {
    const routeCheckResult = routeCheck(routeCheckArray);
    const pathSegments = path.split("/");

    if (pathSegments.includes(routeCheckResult)) {
      const lastSegment = pathSegments.pop();
      return pathSegments[1]
        ? `${pathSegments[1]}/${routeCheckResult}/${lastSegment}`
        : lastSegment;
    }

    return routeCheckResult;
  }

  function buildPath(routeCheckArray) {
    const routeCheckResult = routeCheck(routeCheckArray);
    const pathSegments = path.split("/");

    let name_space = pathSegments.slice(1, -1).join("+");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    if (!name_space && !lastSegment) {
      return false;
    }

    name_space = name_space || routeCheckResult;
    const burst = secondLastSegment || name_space;

    return `?burst=${burst}&name_space=${name_space}&entry=${lastSegment}`;
  }

  switch (param) {
    case "route":
      return routeCheck(appRoutes) || ë.appRoute;

    case "source_path":
      return routeCheckPath(appRoutes) || routeCheck(appRoutes) || ë.appRoute;

    case "buildPath":
      return buildPath(appRoutes);

    case "loadParams":
      /////////////////////////////////
      // This is a work in progress. It will help prevent unauthorized function execution in the vanillaBurst chain
      // and also trigger functions based on entry.

      return {
        burstRoute: burstRoute,
        namespace: namespace,
        entry: entry,
        appRoutes: appRoutes,
      };

    /////////////////////////////////
    default:
      return ë.defaultAppRoute;
  }
});

const stateTag = getRoute("route") || ë.defaultAppRoute;
const buildPath = getRoute("buildPath");
const loadedStateTagPath = getRoute("source_path");
const loadParams = getRoute("loadParams");
function buildStatePath(loadedStateTagPath, stateTag, buildPath) {
  if (loadedStateTagPath) {
    const currentSearchParams = new URLSearchParams(
      ë.location.search
    ).toString();

    if (currentSearchParams !== buildPath) {
      if (buildPath) {
        return loadedStateTagPath + buildPath;
      }

      const burstRoute =
        new URLSearchParams(ë.location.search).get("burst") || stateTag;
      const namespace =
        new URLSearchParams(ë.location.search).get("name_space") || stateTag;
      const entry =
        new URLSearchParams(ë.location.search).get("entry") || "init";

      return `?burst=${burstRoute}&name_space=${namespace}&entry=${entry}`;
    }

    return currentSearchParams.split("?")[0];
  } else {
    const searchParams = new URLSearchParams(ë.location.search);
    const burstRoute = searchParams.get("burst") || stateTag;
    const namespace = searchParams.get("name_space") || stateTag;
    const entry = searchParams.get("entry") || "init";

    return `?burst=${burstRoute}&name_space=${namespace}&entry=${entry}`;
  }
}

const stateTagPath =
  buildStatePath(loadedStateTagPath, stateTag, buildPath) || stateTag;
localStorage.setItem("stateBurst", JSON.stringify([stateTag, stateTagPath]));
ë.frozenVanilla("stateTagPath", stateTagPath);
// Burst the state
ë.vanillaBurst(stateTag, stateTagPath, loadParams);

// Helper function to go back to a previous state
ë.frozenVanilla("goBack", function goBack() {
  if (history.state?.stateTagName !== ë.appRoute) {
    if (history.state && typeof history.state.stateCount === "number") {
      history.go(-history.state.stateCount + 1);
    } else {
      ë.logSpacer("No previous page");
    }
  }
});

// Experimental: Functionality for state jump
ë.frozenVanilla(
  "vanillaGo",
  async function (stateKey, vanillaGoRoute, originBurst) {
    vanillaGoRoute = vanillaGoRoute || stateKey;

    // Check if the stateKey exists in the tracking object
    if (originBurst[stateKey]) {
      const statePosition = Object.keys(originBurst).indexOf(stateKey);
      const stepsToGoBack = -(statePosition + 1);

      history.go(stepsToGoBack);

      // Check if vanillaGoRoute is not equal to stateKey before calling routeCall
      if (vanillaGoRoute !== stateKey) {
        setTimeout(() => routeCall(vanillaGoRoute), 20); // Then run a route call
      }
    } else {
      console.error("State not found in the tracking object");
    }
  }
);
