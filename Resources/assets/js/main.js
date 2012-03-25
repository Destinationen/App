/**
 * This is the main js file for the webViews
 */

/**
 * This will prevenet bouncing, but also scrolling.
 */
function noScroll(){
    document.ontouchmove = function(event){ event.preventDefault(); }
}

/**
 * Opens links externaly
 */
function openLink(link){
    Ti.App.fireEvent('weblink.click', {link: link});
}

