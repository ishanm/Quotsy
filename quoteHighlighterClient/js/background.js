// Constants

var DEFAULT_ITEM = {
    'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
    'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
};

//var SERVER_ADDRESS = 'https://www.shopperspoll.com'
var SERVER_ADDRESS = "http://127.0.0.1:8000";

window.onload = main;

//************************************************//


// Functions

function init(){
    localStorage['closeLoginWarning'] = JSON.stringify(false);
    
    if (!localStorage.hasOwnProperty('list')){
        localStorage['list'] = JSON.stringify([DEFAULT_ITEM]);
    }
    
    var id = chrome.contextMenus.create({
        "title": "Add to quotes",
        "contexts": ["selection"],
        "onclick": addToList
    })
}

// Check if the user is logged in. If he is, add it to the server
// and then add it to the localStorage. Otherwise just add it to the
// localStorage
function addToList(info, tab){
    var item = {};
    item['text'] = info.selectionText;
    item['url'] = info.pageUrl;
    if (JSON.parse(localStorage['currentLoginStatus'])){
        $.post(SERVER_ADDRESS + '/quotes/add/', item, function(data){
            if (!data.responseSuccess){
                //TODO: Open a new tab/some other way of showing that the add wasn't successful
            }
        });
    }
    var list = JSON.parse(localStorage['list']);
    list.push(item);
    localStorage['list'] = JSON.stringify(list);
}

/* Format of the list of all quotes stored in localStorage['list']:
    [
        {
            'text':'Sample quote 1 yo',
            'url':'http://sampleURL1.com' 
        },
        {
            'text':'Sample quote 2 yo',
            'url':'http://sampleURL2.com' 
        },
    ]
*/

function syncAllQuotes(){
    $.getJSON(SERVER_ADDRESS + '/quotes/getAll/', function(result){
        localStorage['list'] = JSON.stringify(result);
    });
}

/* Check if the user is logged in, if he is, then get an 
 * updated list of all his quotes from the server and store
 * them on the front end. If not, show the warning bar that
 * the user is not logged in, and that everything will be cleared
 * on broswer close.
 */

function main(){
    init();
    Common.updateLoginStatus();
    if (JSON.parse(localStorage['currentLoginStatus'])){
        syncAllQuotes();
    }
}
