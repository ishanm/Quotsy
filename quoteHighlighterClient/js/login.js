$(document).ready(function(){
    $("#loginFormSubmit").click(function(event){
        $.post("http://127.0.0.1:8000/accounts/login/", $('#loginForm').serialize(), function(data){
            localStorage['loginStatus'] = data.loginStatus;
            QuoteManager.syncQuotesIfLoggedIn();
        });
    });
});
