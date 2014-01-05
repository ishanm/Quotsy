'use strict';

var allQuotesApp = angular.module('allQuotes', []);

allQuotesApp.controller('AllQuotesController', ['$http', '$scope',
  function($http, $scope) {
  
  /************************************************************************/
  /* Variables                                                            */
  /************************************************************************/
  
  var DEFAULT_ITEM = {
      'text' : "It's a magical world, Hobbes, ol' buddy...Let's go exploring!",
      'url' : 'http://bookriot.com/2012/02/06/sixteen-things-calvin-and-hobbes-said-better-than-anyone-else/'
  };

  // List of all quotes
  $scope.quotes = JSON.parse(localStorage['list']);
  $scope.loggedIn = JSON.parse(localStorage['loginStatus']);
  $scope.loginText = $scope.loggedIn == true ? "Logout" : "Login";
  
  // Map of whether to show the input text field in place of the quote text
  // in the table of quotes. Key is index of the row, and value is boolean
  var editingMode = {};
  
  /************************************************************************/
  /* Functions                                                            */
  /************************************************************************/
  
  $scope.loginHandler = function(){
    if ($scope.loggedIn){
      $http.post(Config.host + '/accounts/logout/', {}).success(function(data, status, headers, config){
        if (data.loginStatus == false){
          localStorage['closeLoginWarning'] = false;
          localStorage['list'] = JSON.stringify([DEFAULT_ITEM]);
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



