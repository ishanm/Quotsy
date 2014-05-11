
$(document).unload(function(){});
$(document).ready(function () {
    enableGoogleAnalytics();
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
            // $('#quoteDiv').css('height', '55%');
            $('#quoteDiv').css('margin-top', '170px');
            $('#actualQuote').css('font-size', '2.8em');
        }
        else{
            // $('#quoteDiv').css('height', '45%');
            $('#quoteDiv').css('margin-top', '220px');
            $('#actualQuote').css('font-size', '3.0em');
        }
        
        
        // Add ellipsis to quotes that are too long
        $('#quoteDiv').dotdotdot({
            ellipsis: '... "',
            height: 480,
            callback: function( isTruncated, orgContent ) {
                // Show the readmore link if the ellipsis was added
                var readMorelink = "<br><a id='readMoreText' href='/html/showAllQuotes.html#" + randomQuote['hash'] + "'>See full quote</a>";
                if (isTruncated){
                   $('#actualQuote').append(readMorelink);
                }
                else{
                    $('#actualQuote').append(" \"");
                }
                $('#actualQuote').prepend("\"");
            },
        });

    }

    function enableGoogleAnalytics(){
        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = 'https://ssl.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    }
});

