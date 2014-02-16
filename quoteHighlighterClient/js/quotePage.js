$(document).ready(function () {
    setClickHandlers();
    setLoginWarningBarState();
    displayQuote(QuoteManager.getRandomQuote());
    
    function setClickHandlers(){
        $('#refreshButton').click(function(){
            displayQuote(QuoteManager.getRandomQuote());
        });
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
        $('#actualQuote').html(randomQuote['text']);
        $('#quoteDiv').ellipsis(randomQuote);
        $('#actualQuote').prepend("\"");
        $('#actualQuote').append("\"");
    }
});

