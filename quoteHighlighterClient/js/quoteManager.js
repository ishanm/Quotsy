QuoteManager = function(){
    
    /************************************************************************/
    /* Module Functions                                                     */
    /************************************************************************/
    
    /*
     * If the user is logged in, gets the list of quotes from the server for
     * the user and puts them in localStorage for quick access.
     * 
     * Format of the list of all quotes stored in localStorage['list']:
     * [
     *  {
     *      'text':'Sample quote 1 yo',
     *      'url':'http://sampleURL1.com' 
     *  },
     *  {
     *      'text':'Sample quote 2 yo',
     *      'url':'http://sampleURL2.com' 
     *  },
     * ]
     */
    function syncQuotesIfLoggedIn(){
        if (localStorage['loginStatus'] == true){
            $.getJSON(SERVER_ADDRESS + '/quotes/getAll/', function(result){
                localStorage['list'] = JSON.stringify(result);
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
    
    /************************************************************************/
    /* Module Interface                                                     */
    /************************************************************************/
    return {
        syncQuotesIfLoggedIn : syncQuotesIfLoggedIn,
        getRandomQuote : getRandomQuote,
        addQuote : addQuote
    };
}();