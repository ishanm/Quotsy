'use strict';

var allQuotesApp = angular.module('allQuotes', []);

allQuotesApp.controller('AllQuotesController', ['$http', '$scope',
  function($http, $scope) {
  
  /************************************************************************/
  /* Variables                                                            */
  /************************************************************************/

  // List of all quotes
  $scope.quotes = JSON.parse(localStorage['list']);
  $scope.loggedIn = JSON.parse(localStorage['loginStatus']);
  $scope.closeLoginWarning = JSON.parse(localStorage['closeLoginWarning']);
  $scope.loginText = $scope.loggedIn == true ? "Logout" : "Login";
  
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
      $http.post(Config.host + '/accounts/logout/', {}).success(function(data, status, headers, config){
        if (data.loginStatus == false){
          localStorage['closeLoginWarning'] = false;
          $scope.closeLoginWarning = JSON.parse(localStorage['closeLoginWarning']);
          localStorage['list'] = JSON.stringify([]);
          $scope.quotes = JSON.parse(localStorage['list']);
          localStorage['loginStatus'] = false;
          $scope.loggedIn = JSON.parse(localStorage['loginStatus']);
          $scope.loginText = "Login"; 
        }
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
    localStorage['list'] = JSON.stringify($scope.quotes);
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
      localStorage['list'] = JSON.stringify($scope.quotes);
    }
    
  }
  
  $scope.deleteQuote = function(index){
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
  
  $scope.isEmptyListMessage = function(){
    return $scope.quotes.length == 0;
  }
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



