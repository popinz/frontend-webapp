(function(){
	var parentProfile = angular.module('parentProfile', ['translateModule']);
	parentProfile.controller("parentProfileCtrl", ["$scope", "$routeParams", function($scope, $routeParams){
        $scope.setPageLanguage($routeParams.langId);
    }]);

})();