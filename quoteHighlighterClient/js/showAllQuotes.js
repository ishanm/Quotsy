//var SERVER_ADDRESS = 'https://www.shopperspoll.com'
var SERVER_ADDRESS = "http://127.0.0.1:8000";

var contentDivString = " \n\
        <div class='content'> \n\
          <div id='bullet'> \n\
            <img src='bullet.png' /> \n\
          </div> \n\
          <div id='quote'> \n\
            <h2>%actualQuote%</h2> \n\
          </div> \n\
          <div id='url'> \n\
            http://www.google.com \n\
          </div> \n\
            <a class='closeButton' id='%quoteId%' href='#'></a> \n\
          <hr> \n\
        </div>";
        
$(document).ready(function() {
    //Show login bar depending on whether the user is logged in or not
    
    //Show all the quotes in the grid
    var list = JSON.parse(localStorage['list']);
    
    for (var i in list){
        var quote = contentDivString.replace("%actualQuote%", list[i]['text']);
        quote = quote.replace('%quoteId%', i);
        $(quote).appendTo('.container');
    }
    
    //Bind the delete button to a handler that deletes that quote
    $('.closeButton').click(deleteClickHandler);
    
    function deleteClickHandler(){
        var item = {}
        item['quoteId'] = this.id;
        
        $.post(SERVER_ADDRESS + '/quotes/delete/', item, function(data){
            if (!data.responseSuccess){
                //TODO: Open a new tab/some other way of showing that the add wasn't successful
            }
        });
    }

});