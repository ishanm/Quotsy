'use strict';

var allQuotesApp = angular.module('allQuotes', []);

allQuotesApp.controller('AllQuotesController', function($scope) {
  $scope.quotes = JSON.parse(localStorage['list']);
  
  $scope.saveQuotes = function(event){
    event.stopPropagation();
    
    localStorage['list'] = JSON.stringify($scope.quotes);
  }
});
