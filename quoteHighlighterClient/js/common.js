Common = function(){
    function updateLoginStatus(){
        $.ajax({
            type: 'GET',
            url: SERVER_ADDRESS + '/accounts/loginStatus/',
            dataType: 'json',
            success: function(result){
                localStorage['previousLoginStatus'] = localStorage['currentLoginStatus'];
                localStorage['currentLoginStatus'] = result['status'];
            },
            async: false
        });
    }
    
    return {
        updateLoginStatus : updateLoginStatus
    };
    
}();