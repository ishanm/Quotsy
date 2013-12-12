$(document).ready(function(){
    $("#registerFormSubmit").click(function(event){
        hideErrorMsg();
        showBusy();

        var validationResult = validateUserInput();
        if (!validationResult){
            return;
        }
        
        // If validation passes go ahead with registration
        $.post("http://127.0.0.1:8000/accounts/login/", $('#registerForm').serialize(), function(data){
            localStorage['loginStatus'] = data.loginStatus;
            QuoteManager.syncQuotesIfLoggedIn();
            hideBusy();

        });
    });
    
    // Basic user input validation. If any errors, show error message and return false. Else return true
    function validateUserInput(){
        if ($('#username').val() == ''){
            showErrorMsg("Please enter a value for the username and try again.");
            hideBusy();
            return false;
        }
        if ($('#password').val() == ''){
            showErrorMsg("Please enter a value for the password and try again.");
            hideBusy();
            return false;
        }
        if ($('#confirmPassword').val() == ''){
            showErrorMsg("Please enter a value for the confirm password and try again.");
            hideBusy();
            return false;
        }
        
        if ($('#password').val() != $('#confirmPassword').val()){
            showErrorMsg("The passwords don't match. Please fix it and try again.");
            hideBusy();
            return false;
        }
        
        return true;
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
