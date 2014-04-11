'use strict';

var allQuotesApp = angular.module('allQuotes', []);

allQuotesApp.controller('AllQuotesController', ['$http', '$scope', '$timeout', 'quoteManagerServer',
  function($http, $scope, $timeout, quoteManagerServer) {
  
  /************************************************************************/
  /* Variables                                                            */
  /************************************************************************/

  // List of all quotes
  $scope.quotes = JSON.parse(localStorage['list']);
  $scope.loggedIn = JSON.parse(localStorage['loginStatus']);
  $scope.closeLoginWarning = JSON.parse(localStorage['closeLoginWarning']);
  $scope.loginText = $scope.loggedIn == true ? "Logout" : "Login";
  $scope.highlightDone = false;
  
  // Map of whether to show the input text field in place of the quote text
  // in the table of quotes. Key is index of the row, and value is boolean
  var editingMode = {};
  
  /************************************************************************/
  /* Functions                                                            */
  /************************************************************************/
  
  // Show 'Login' or 'Logout' in the navbar according to the login status.
  // For the logout logic, reset all the localstorage values. For the login
  // logic redirect to login page
  $scope.loginHandler = function(){
    if ($scope.loggedIn){
      // Remove trailing forward slash
      var logoutUrl = Config.host.replace(/\/$/, "") + "/accounts/logout/";
      
      var data = $.param({
        sid:localStorage['sid']
      });
      var config = {
        headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }
        
      $http.post(logoutUrl, data, config).success(function(data, status, headers, config){
        $scope.closeLoginWarning = false;
        $scope.quotes = [];
        $scope.loggedIn = false;
        $scope.loginText = "Login"; 
      })
    }
    else{
      window.location.replace("/html/login.html");
    }
  }
  
  $scope.hideLoginStatusWarning = function(){
    $scope.closeLoginWarning = localStorage['closeLoginWarning'] = true;
  }

  // Adds a quote by prepending an empty quote to the list, and setting
  // the edit mode status of the new row as true after disabling all the
  // other rows that were being edited
  $scope.addQuote = function(){
    $scope.quotes.unshift({'text':'', 'url':''});
    for (var key in editingMode){
      editingMode[key] = false;
    }
    editingMode[0] = true;
  }
  
  // Sets edit mode as true if the row isn't on edit mode.
  // If it is, it updates the quote on localStorage and the server
  // if the user is logged in
  $scope.editQuote = function(index){
    if ($scope.isEditModeOff(index)){
      editingMode[index] = true;
    }
    else{
      editingMode[index] = false;
      // Regardless of whether we're editing or adding a new quote, the hash of the quote
      // needs to be updated
      var newHash = CryptoJS.MD5($scope.quotes[index].text).toString();
      $scope.quotes[index].hash = newHash;

      // Update the server copy if the user is logged in
      if ($scope.loggedIn){
        if ($scope.quotes[index].hasOwnProperty('id')){
          quoteManagerServer.updateQuote(localStorage['sid'], $scope.quotes[index].text, newHash, $scope.quotes[index].id);
        }
        // Add the quote to the server and add the returned ID of the quote to the local version
        else{
          quoteManagerServer.addQuote(localStorage['sid'], $scope.quotes[index].text, newHash, function(data){
            $scope.quotes[0].id = data.quote_id;
          });
        }
      }
    }
    
  }
  
  $scope.deleteQuote = function(index){
    if ($scope.loggedIn && $scope.quotes[index].hasOwnProperty('id')){
      console.log('Going to try and delete a quote');
      var delete_url = Config.host.replace(/\/$/, "") + "/quotes/delete/";
      var data = $.param({
        sid:localStorage['sid'],
        quote_id:$scope.quotes[index].id
      });
      var config = {
        headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }
      
      $http.post(delete_url, data, config).success(function(data, status, headers, config){
        console.log('Deleted the quote successfully');
      })
    }
    $scope.quotes.splice(index, 1);
    localStorage['list'] = JSON.stringify($scope.quotes);
  }
  
  // Returns true if we need to show the individual
  // quote text in the list of quotes (or the input field)
  $scope.isEditModeOff = function(index){
    return !editingMode.hasOwnProperty(index) || !editingMode[index];
  }
  
  // Css for the edit button depending on whether that row is in edit mode
  $scope.editButtonCss = function(index){
    var css = "glyphicon";
    
    if ($scope.isEditModeOff(index))
      css += " glyphicon-pencil";
    else
      css += " glyphicon-ok saveEdits";
    return css;
  }
  
  // Css for the delete button depending on if that row is in edit mode
  $scope.deleteButtonCss = function(index){
    var css = "btn btn-link noBorder";
    
    if (!$scope.isEditModeOff(index))
      css += " disabled";
    return css;
  }
  
  $scope.checkHighlight = function(index){
    console.log('Entering checkHighlight');
    if (('#' + $scope.quotes[index].hash == window.location.hash)
        && $scope.highlightDone == false){
      $timeout(function(){
        $scope.highlightDone = true;
      }, 400);
      return "blinkOn";
    }
    else{
      return "blinkOff";
    }
  }
  
  $scope.isEmptyListMessage = function(){
    return $scope.quotes.length == 0;
  }
  
  // Watchers to keep the localStorage in sync with angular models
  $scope.$watch('quotes', function(newVal, oldVal){
    localStorage['list'] = JSON.stringify($scope.quotes);
  }, true)
  
  $scope.$watch('loggedIn', function(newVal, oldVal){
    localStorage['loginStatus'] = JSON.stringify($scope.loggedIn);
  }, true)
  
  $scope.$watch('closeLoginWarning', function(newVal, oldVal){
    localStorage['closeLoginWarning'] = JSON.stringify($scope.closeLoginWarning);
  }, true)
  
}]);

// Directive to run the function provided in 'on-enter' attribute in html
// every time the user presses the enter key
allQuotesApp.directive('onEnter', function(){
  return function(scope, element, attrs){
    element.bind("keydown keypress", function(event){
      if (event.which === 13){
        scope.$apply(function (){
            scope.$eval(attrs.onEnter);
        });

        event.preventDefault();
      }
    })
  }
})

allQuotesApp.service('quoteManagerServer', function($http){
  this.updateQuote = function(sid, quoteText, quoteHash, quoteId){
    var update_url = Config.host.replace(/\/$/, "") + "/quotes/update/";
    var data = $.param({
      sid:sid,
      quote_text:quoteText,
      quote_hash:quoteHash,
      quote_id:quoteId
    });
    var config = {
      headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
    }
    
    $http.post(update_url, data, config).success(function(data, status, headers, config){
      console.log('Updated the quote successfully');
    })
  }

  this.addQuote = function(sid, quoteText, quoteHash, successCb){
    var add_url = Config.host.replace(/\/$/, "") + "/quotes/add/";
    var data = $.param({
      sid:sid,
      quote_text:quoteText,
      quote_hash:quoteHash,
    });
    var config = {
      headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
    }
    
    $http.post(add_url, data, config).success(function(data, status, headers, config){
      console.log('Added the quote successfully');
      successCb(data);
    })    
  }
})





