$(document).ready(function(){
    $("#loginFormSubmit").click(function(event){
        // Clear any validation errors shown from previous failed attempt
        hideErrorMsg();
        showBusy();
        
        var validationPassed = validateUserInput();
        if (!validationPassed){
            return;
        }
        
        // Remove trailing forward slash
        var loginUrl = Config.host.replace(/\/$/, "") + "/accounts/login/";
        
        $.post(loginUrl , $('#loginForm').serialize(), function(data){
            if (!data.isSuccess){
                showErrorMsg(data.errorMsg);
                hideBusy();
                return;
            }
            localStorage['loginStatus'] = true;
            localStorage['sid'] = data.sid;

            QuoteManager.syncQuotesIfLoggedIn(function(){
                window.location.replace("/html/showAllQuotes.html");
            });
        }).fail(function(){
            showErrorMsg("Oh snap! Something broke! Please try again in a bit.");
            hideBusy();
        });
    });
    
    // Basic user input validation. If any errors, show error message and return false. Else return true
    function validateUserInput(){
        var validationPassed = true;
        
        if ($('#username').val() == ''){
            showErrorMsg("Please enter a value for the username and try again.");
            validationPassed = false;
        }
        else if ($('#password').val() == ''){
            showErrorMsg("Please enter a value for the password and try again.");
            validationPassed = false;
        }
        
        if (!validationPassed){
            // Clear the busy sign so we can show error message
            hideBusy();
        }
        return validationPassed;
    }
    
    // Show busy symbol + disable submit button
    function showBusy(){
        $('#loginFormSubmit').addClass("disabled");
        $('#loadingIndicatorDiv').show();
    }
    
    // Hide busy symbol + enable submit button
    function hideBusy(){
        $('#loginFormSubmit').removeClass("disabled");
        $('#loadingIndicatorDiv').hide();
    }
    
    function showErrorMsg(errorMsg){
        $('#errorMessage').append(errorMsg);
        $('#errorMessage').show();
    }
    
    function hideErrorMsg(){
        $('#errorMessage').empty();
        $('#errorMessage').hide();
    }
});
