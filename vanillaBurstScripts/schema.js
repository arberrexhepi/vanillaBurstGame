
window.vanillaConfig = function vanillaConfig(landing, passedConfig) {
  let landingRequest = landing + 'Request';
  let buildConfig = {};
  buildConfig[landing] = {
      'landing': landing,
      'scripts': window.vanillaBurstScripts, // Array of required script paths
      'preloader': window.baseUrl + 'preloader.js', // Assuming this path is correct
      'customFunctions': {
          [landingRequest]: {
              'role': 'rollCall',
              'dir': 'server/'+landing+'/',
              'functionFile': landingRequest,
              'render': 'burst',
              'originBurst': landing
          },
          ...passedConfig
      }
  };
  //alert(JSON.stringify(buildConfig[landing]));
  return buildConfig[landing];
};


window.buildRollCall = async function buildRollCall(rollCall, renderSchema, runFunction){

renderSchema = window.renderSchema;
await renderSchema;
await window.runFunction
if(runFunction === 'functionBurst'){
  //runFunction = ''
  rollCall = window.rollCall;
 window.rollCall = rollCall;
 window.runRoll = 'rollBurst';
 await window.childFunction(renderSchema, rollCall, runRoll);
 

  }

}


window.config = function config() {
  let schema = {};

  for (let part in window.schemaParts) {
    if (window.schemaParts.hasOwnProperty(part)) {

      let packageNames = window.schemaParts[part];
      if (packageNames === false) continue; // Skip non-views

      let partResults = {};
      let partConfig = window[`${part}Config`] ? window[`${part}Config`]() : {};
      let customFunctions = partConfig.customFunctions || {};

      if (Array.isArray(packageNames)) {
        packageNames.forEach(packageName => {
          let individualPackageNames = packageName.includes(',') ?
            packageName.split(',').map(name => name.trim()) : [packageName];

          individualPackageNames.forEach(individualPackageName => {
            let functionNames = window[individualPackageName];
            if (Array.isArray(functionNames)) {
              functionNames.forEach(funcName => {
                let funcNameConfig = `${funcName}Config`;
                if (typeof window[funcNameConfig] === 'function') {
                  let result = window[funcNameConfig](part);
                  if (result && typeof result === 'object') {
                    // Directly merge into the customFunctions object
                    Object.assign(customFunctions, result);
                  }
                } else {
                  console.error(`Function ${funcNameConfig} not found.`);
                }
              });
            }
          });
        });
      }

      // Assign the constructed customFunctions to the partConfig
      partConfig.customFunctions = customFunctions;
      schema[part] = partConfig;
    }
  }

  console.log("Schema built:", schema);
  return schema;
};







