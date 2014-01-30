$(document).ready(function(){
    $("#registerFormSubmit").click(function(event){
        // Clear any validation errors shown from previous failed attempt
        hideErrorMsg();
        showBusy();

        var validationPassed = validateUserInput();
        if (!validationPassed){
            return;
        }
        
        var registerUrl = Config.host.replace(/\/$/, "") + "/accounts/register/";
        // If validation passes go ahead with registration
        $.post(registerUrl, $('#registerForm').serialize(), function(data){
            if (!data.isSuccess){
                showErrorMsg(data.errorMsg);
                hideBusy();
                return;
            }
            localStorage['loginStatus'] = true;
            localStorage['sid'] = data.sid;
            
            // The user might have registered after he already has a collection on
            // localStorage. Need to save those on the server, so call sync
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
        else if ($('#confirmPassword').val() == ''){
            showErrorMsg("Please enter a value for the confirm password and try again.");
            validationPassed = false;
        }
        
        else if ($('#password').val() != $('#confirmPassword').val()){
            showErrorMsg("The passwords don't match. Please fix it and try again.");
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
        $('#registerFormSubmit').addClass("disabled");
        $('#loadingIndicatorDiv').show();
    }

    // Hide busy symbol + enable submit button
    function hideBusy(){
        $('#registerFormSubmit').removeClass("disabled");
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
