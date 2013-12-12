$(document).ready(function(){
    $("#registerFormSubmit").click(function(event){
        $('#registerFormSubmit').addClass("disabled");
        $('#loadingIndicatorDiv').show();
        $.post("http://127.0.0.1:8000/accounts/login/", $('#registerForm').serialize(), function(data){
            localStorage['loginStatus'] = data.loginStatus;
            QuoteManager.syncQuotesIfLoggedIn();
            $('#registerFormSubmit').removeClass("disabled");
            $('#loadingIndicatorDiv').hide();
        });
    });
});
