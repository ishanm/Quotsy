QuoteManager = function(){
    
    /************************************************************************/
    /* Module Functions                                                     */
    /************************************************************************/
    
    /*
     * If the user is logged in, gets the list of quotes from the server for
     * the user and puts them in localStorage for quick access. Also updates
     * the server collection with whatever was on localStorage before the user
     * logged in
     * 
     * Format of the list of all quotes stored in localStorage['list']:
     * [
     *  {
     *      'id':1,
     *      'text':'Sample quote 1 yo',
     *      'url':'http://sampleURL1.com' 
     *  },
     *  {
     *      'id':2,
     *      'text':'Sample quote 2 yo',
     *      'url':'http://sampleURL2.com' 
     *  },
     * ]
     */
    function syncQuotesIfLoggedIn(successcb){
        if (JSON.parse(localStorage['loginStatus']) == true){
            // Update the server copy with the quotes in localstorage
            $.getJSON(Config.host + '/quotes/getAll/', function(result){
                localStorage['list'] = JSON.stringify(result);
                successcb();
            });
        }
    }
    
    // Returns a random quote from the list of quotes for the user
    // stored in local storage
    function getRandomQuote(){
        var allQuotes = JSON.parse(localStorage['list']);
        var allKeys = Object.keys(allQuotes);
        var randomKey = allKeys[Math.floor(allKeys.length * Math.random())];
        var randomQuote = allQuotes[randomKey];
        return randomQuote;
    }
    
    // Check if the user is logged in. If he is, add it to the server
    // and then add it to the localStorage. Otherwise just add it to the
    // localStorage
    function addQuote(info, tab){
        var item = {};
        item['text'] = info.selectionText;
        item['url'] = info.pageUrl;
        if (JSON.parse(localStorage['loginStatus'])){
            $.post(Config.host + '/quotes/add/', item, function(data){
                if (!data.responseSuccess){
                    //TODO: Open a new tab/some other way of showing that the add wasn't successful
                }
            });
        }
        var list = JSON.parse(localStorage['list']);
        list.push(item);
        localStorage['list'] = JSON.stringify(list);
    }
    
    /************************************************************************/
    /* Module Interface                                                     */
    /************************************************************************/
    return {
        syncQuotesIfLoggedIn : syncQuotesIfLoggedIn,
        getRandomQuote : getRandomQuote,
        addQuote : addQuote
    };
}();