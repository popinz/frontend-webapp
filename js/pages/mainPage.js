/*
 *  Copyright (C) 2017 Popinz.co
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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