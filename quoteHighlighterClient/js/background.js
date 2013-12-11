
/************************************************************************/
/* Constants                                                            */
/************************************************************************/
var DEFAULT_ITEM = {
    'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
    'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
};

//var SERVER_ADDRESS = 'https://www.shopperspoll.com'
var SERVER_ADDRESS = "http://127.0.0.1:8000";

window.onload = main;

/************************************************************************/
/* Functions                                                            */
/************************************************************************/

// Initialize the values we'll need in localStorage if they don't already exist
function initLocalStorage(){
    if (!localStorage.hasOwnProperty('closeLoginWarning')){
        localStorage['closeLoginWarning'] = JSON.stringify(false);
    }
    
    if (!localStorage.hasOwnProperty('list')){
        localStorage['list'] = JSON.stringify([DEFAULT_ITEM]);
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
