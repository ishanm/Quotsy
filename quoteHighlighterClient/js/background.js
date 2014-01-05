
/************************************************************************/
/* Constants                                                            */
/************************************************************************/
var DEFAULT_ITEM = {
    'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
    'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
};

window.onload = main;

/************************************************************************/
/* Functions                                                            */
/************************************************************************/

// Initialize the values we'll need in localStorage if they don't already exist
function initLocalStorage(){
    if (!localStorage.hasOwnProperty('closeLoginWarning')){
        localStorage['closeLoginWarning'] = false;
    }
    
    if (!localStorage.hasOwnProperty('list')){
        localStorage['list'] = JSON.stringify([DEFAULT_ITEM]);
    }
    
    if (!localStorage.hasOwnProperty('loginStatus')){
        localStorage['loginStatus'] = false;
    }
}

// Setup the 'Add to Quotsy' context menu
function setupContextMenu(){
    chrome.contextMenus.create({
        "title": "Add to Quotsy",
        "contexts": ["selection"],
        "onclick": QuoteManager.addQuote
    })
}

function main(){
    initLocalStorage();
    setupContextMenu();
}
