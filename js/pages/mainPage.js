(function(){
	var mainPage = angular.module('mainPage', ['translateModule']);
	mainPage.controller("mainPageCtrl", ["$scope",  "$rootScope", "$location", "$window", "$routeParams", function($scope, $rootScope, $location, $window, $routeParams){
        $scope.setPageLanguage($routeParams.langId);
        $scope.signup = function(userType){
            $rootScope.accountType = userType;
            $location.path('/signup/'+$rootScope.lang);
            $window.scrollTo(0,0);
        };
    }]);

})();