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
            var syncUrl = Config.host.replace(/\/$/, "") + "/quotes/sync/";
      
            // Update the server copy with the quotes in localstorage
            $.post(syncUrl, {
                sid : localStorage['sid'],
                quotes : localStorage['list']
                }, function(result){
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
        //console.log(randomKey);
        var randomQuote = allQuotes[randomKey];
        //console.log(randomQuote);
        return randomQuote;
    }
    
    // Check if the user is logged in. If he is, add it to the server
    // and then add it to the localStorage. Otherwise just add it to the
    // localStorage
    function addQuote(info, tab){
        var item = {};
        item['text'] = info.selectionText;
        item['url'] = info.pageUrl;
        item['hash'] = CryptoJS.MD5(info.selectionText).toString();
        if (JSON.parse(localStorage['loginStatus'])){
            // Remove trailing forward slash
            var addUrl = Config.host.replace(/\/$/, "") + "/quotes/add/";
            var data = $.param({
              sid: localStorage['sid'],
              quote_text: item['text'],
              quote_url: item['url'],
              quote_hash: item['hash'] 
            });
            
            $.post(addUrl, data, function(data){
                // Since the user is logged in, update the db with the new quote, 
                // get the new quotes id, and then add this to the localstorage
                item['id'] = data.quote_id;
                var list = JSON.parse(localStorage['list']);
                list.push(item);
                localStorage['list'] = JSON.stringify(list);
            });
        }
        else{
            var list = JSON.parse(localStorage['list']);
            list.push(item);
            localStorage['list'] = JSON.stringify(list);
        }

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