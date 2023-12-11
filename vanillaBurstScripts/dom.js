// window.vanillaDOM = async function({ htmlPath, cssPath }, vanillaDOMcallback) {
//     try {
//         const htmlResponse = await fetch(htmlPath);
//         const htmlContent = await htmlResponse.text();
       
//         // Call the callback function with the HTML content
//         if (typeof vanillaDOMcallback === 'function') {
//             vanillaDOMcallback(htmlContent);
//         }
//  if (cssPath) {
//             const cssResponse = await fetch(cssPath);
//             const css = await cssResponse.text();
//             const style = document.createElement('style');
//             style.textContent = css;
//             document.head.appendChild(style);
//         }
       
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };



window.vanillaDOM = async function ({ htmlPath, cssPath }, vanillaDOMcallback) {
    try {
        const htmlResponse = await fetch(htmlPath);
        const htmlContent = await htmlResponse.text();

        // Call the callback function with the HTML content
        if (typeof vanillaDOMcallback === 'function') {
            vanillaDOMcallback(htmlContent);
        }
        if (cssPath) {
            const cssResponse = await fetch(cssPath);
            const css = await cssResponse.text();
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            
        }

    } catch (error) {
        console.error('Error:', error);
    }
};


async function miniDOM(thisHere, initView) {
    passedFunction =thisHere;
    let htmlPath;
    let cssPath;
    let targetDOM;

    if (passedFunction.functionFile) {
        htmlPath = thisHere.htmlPath;
    }

    if (passedFunction.functionFile) {
        functionFile = thisHere.functionFile;
    }
    if (passedFunction.cssPath) {
        cssPath = thisHere.cssPath;
    }
    if (passedFunction.targetDOM) {
        targetDOM = thisHere.targetDOM;
    }
 
    if(window.originBurst?.[functionFile]?.[functionFile]?.serverResult !==undefined){
        alert('hey')

        document.getElementById(targetDOM).innerHTML = window.originBurst[functionFile][functionFile].serverResult;
        initView();
    }else{
        continueDOM(htmlPath, cssPath);
    }

     function continueDOM(htmlPath, cssPath){
        window.vanillaDOM({ htmlPath, cssPath },async (htmlContent) => {
            alert(htmlPath)
            // Apply the HTML content to the DOM
            document.getElementById(targetDOM).innerHTML = htmlContent;
            if(window.originBurst?.[functionFile]?.[functionFile] !== undefined){
                window.originBurst[functionFile][functionFile].serverResult = htmlContent
                await window.originBurst[functionFile][functionFile].serverResult
                window.signalBurst('load', ['getSignal'], htmlContent);
            }else{
                alert('yo')

            }
            initView();

        })
    }
    
}


///test an idea with this below maybe not connected to anything 
window.checkDOM = function checkDOM(renderSchema){
    renderSchema = window.renderSchema;
    alert(JSON.stringify(renderSchema))
    let thestate= history.state.stateTagName;
    let functionFile;


    let hasDOM = false;
    let targetDOM = renderSchema.customFunctions[thestate].targetDOM;
    alert(targetDOM);
    if(window.originBurst?.[thestate]?.[thestate]?.serverResult!== undefined){
        checkDOM = window.originBurst[thestate][thestate].serverResult;
        if (checkDOM){
            hasDOM = true;
            document.getElementById(targetDOM).innerHTML = window.originBurst[thestate][thestate].serverResult;
    
            alert(hasDOM)
          
           // return hasDOM

        }
    }else{
        hasDOM = false;
        alert(hasDOM)

      //  return hasDOM;
    }


}