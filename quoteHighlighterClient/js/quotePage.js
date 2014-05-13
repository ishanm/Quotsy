
$(document).unload(function(){});
$(document).ready(function () {
    enableGoogleAnalytics();
    setClickHandlers();
    setLoginWarningBarState();
    displayQuote(QuoteManager.getRandomQuote());
    
    function setClickHandlers(){
        $('#refreshButton').click(function(){
            location.reload();
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
        if (randomQuote['url'] && randomQuote['url'] != ""){
            $('#actualQuote').attr('href', randomQuote['url']);
        }
        else{
            $('#actualQuote').attr("disabled","disabled").css("cursor", "default")
            $(actualQuote).css('textDecoration', 'none');
        }
        
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
                var readMorelink = "<br>";
                if (isTruncated){
                    $('#readMoreText').attr('href', '/html/showAllQuotes.html#' + randomQuote['hash']);
                    $('#readMoreText').show();
                    $('#actualQuote').append(readMorelink);
                }
                else{
                    $('#actualQuote').append(" \"");
                    $('#readMoreText').hide();
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

