//var SERVER_ADDRESS = 'https://www.shopperspoll.com'
var SERVER_ADDRESS = "http://127.0.0.1:8000";

var DEFAULT_ITEM = {
    'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
    'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
};

$(document).ready(function () {
    updateLoginStatus();
    setLoginWarningBarState();
    showARandomQuote();
    
    setClearCache();

    //TEMPORARY
    function setClearCache(){
        $('#clearCache').bind('click', function clearCache(){
            localStorage.clear();
            alert('cache cleared');
        })
    }

    function setLoginWarningBarState(){
        if (!JSON.parse(localStorage['currentLoginStatus']) && !JSON.parse(localStorage['closeLoginWarning'])){
            $('.warning').show();
            $('#closeButton').bind('click', function closeLoginWarning(){
                $('.warning').hide(300);
                localStorage['closeLoginWarning'] = JSON.stringify(true);
            });
        }
        else{
            $('.warning').hide();
        }
    }

    //TODO: NEED TO MOVE THIS TO A COMMON FILE
    function updateLoginStatus(){
        
        Common.updateLoginStatus();
        
        //if the previous login status was false, and the latest one is true,
        //that means that we have to sync all the quotes from the server. If
        //the previous login status was true and the latest one is false, it
        //means that the user has logged out and we need to clear the quotes
        //from the local storage.
        
        if (!JSON.parse(localStorage['previousLoginStatus']) && JSON.parse(localStorage['currentLoginStatus'])){
            syncAllQuotes();
        }
        else if (JSON.parse(localStorage['previousLoginStatus']) && !JSON.parse(localStorage['currentLoginStatus']) ){
            localStorage['list'] = JSON.stringify([DEFAULT_ITEM]);
        }
    }
    
    function syncAllQuotes(){
        $.getJSON(SERVER_ADDRESS + '/quotes/getAll/', function(result){
            localStorage['list'] = JSON.stringify(result);
        });
    }
    
    function showARandomQuote(){
        var allQuotes = JSON.parse(localStorage['list']);
        var randomQuote = getRandomQuote(allQuotes);
        displayQuote(randomQuote);
    }

    function getRandomQuote(allQuotes){
        var allKeys = Object.keys(allQuotes);
        var randomKey = allKeys[Math.floor(allKeys.length * Math.random())];
        return allQuotes[randomKey];
    }
    
    function displayQuote(randomQuote){
        $('#actualQuote').append(randomQuote['text']);
        //$('#quoteDiv').ellipsis(randomQuote);
        $('#actualQuote').prepend("\"");
        $('#actualQuote').append("\"");
    }
});

