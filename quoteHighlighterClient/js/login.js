$(document).ready(function(){
    $("#loginFormSubmit").click(function(event){
        $('#loginFormSubmit').addClass("disabled");
        $('#loadingIndicatorDiv').show();
        $.post("http://127.0.0.1:8000/accounts/login/", $('#loginForm').serialize(), function(data){
            localStorage['loginStatus'] = data.loginStatus;
            QuoteManager.syncQuotesIfLoggedIn();
            $('#loginFormSubmit').removeClass("disabled");
            $('#loadingIndicatorDiv').hide();
        });
    });
});
