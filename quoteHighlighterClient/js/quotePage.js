//var SERVER_ADDRESS = 'https://www.shopperspoll.com'
var SERVER_ADDRESS = "http://127.0.0.1:8000";

var DEFAULT_ITEM = {
    'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
    'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
};

$(document).ready(function () {
    //updateLoginStatus();
    setLoginWarningBarState();
    displayQuote(QuoteManager.getRandomQuote());
    
    setClearCache();

    //TEMPORARY
    function setClearCache(){
        $('#clearCache').bind('click', function clearCache(){
            localStorage.clear();
            alert('cache cleared');
        })
    }

    function setLoginWarningBarState(){
        if (!JSON.parse(localStorage['loginStatus']) && !JSON.parse(localStorage['closeLoginWarning'])){
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

    function displayQuote(randomQuote){
        $('#actualQuote').append(randomQuote['text']);
        //$('#quoteDiv').ellipsis(randomQuote);
        $('#actualQuote').prepend("\"");
        $('#actualQuote').append("\"");
    }
});

