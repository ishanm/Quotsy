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
        var quote = randomQuote['text'];
        $('#actualQuote').html(randomQuote['text']);
        
        // Dynamically adjust the size and position of the quote
        // depending on the length of the quote text
        if ($('#actualQuote').html().length > 250){
            $('#quoteDiv').css('height', '35%');
            $('#quoteDiv').css('margin-top', '180px');
            $('#actualQuote').css('font-size', '2.8em');
        }
        else{
            $('#quoteDiv').css('height', '30%');
            $('#quoteDiv').css('margin-top', '220px');
            $('#actualQuote').css('font-size', '3.2em');
        }
        
        
        // Add ellipsis to quotes that are too long
        $('#quoteDiv').dotdotdot({
            ellipsis: '... "',
            callback: function( isTruncated, orgContent ) {
                // Show the readmore link if the ellipsis was added
                var readMorelink = "<a href='/html/showAllQuotes.html#" + randomQuote['hash'] + "'>Read the rest</a>";
                if (isTruncated){
                    $('#readMoreLink').html(readMorelink);
                }
                else{
                    $('#actualQuote').append(" \"");
                }
                $('#actualQuote').prepend("\"");
                
            
            },
        });

    }
});

