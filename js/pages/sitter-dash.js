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
	var sitterDash = angular.module('sitterDash', ['ngRoute', 'availabilityCalendar', 'jobs']);
	sitterDash.controller("sitterDashCtrl", ["$scope", '$rootScope', '$routeParams', '$location', function($scope, $rootScope, $routeParams, $location){
	        console.log($rootScope.user);
	        $scope.setPageLanguage($routeParams.langId);
	        $scope.sitter = {};
	        $scope.data_loaded = false;
			console.log("sitterDashCtrl");
	       	if($rootScope.user.userType === "sitter")
	        {
	        	$scope.registeredJobSearch = true;
	        	$scope.filters = {jobType:""};
				gapi.client.sitterProfileApi.getSitterProfile($rootScope.user.creds).execute(
					function (response) {
						console.log(response);
						$scope.sitter = response;
						//$.extend($scope.sitter, $rootScope.user.creds);

						$scope.data_loaded = true;
						$scope.$apply();
					}
				);
	        }
	        else
	        {
	        	$scope.anonymousJobSearch = true;
	        	$scope.data_loaded = true;
	        	$location.path("/jobs/"+$scope.lang);
	           // console.log("please login as a sitter");
	        }
        }]);

        sitterDash.controller("anJobsCtrl", ["$scope", '$rootScope', '$routeParams', '$location', function($scope, $rootScope, $routeParams, $location){
			$scope.setPageLanguage($routeParams.langId);
			console.log("anonymous jobs ctrl");
			if($rootScope.user.userType === "sitter")
			{
				$location.path("/sitter-dash/"+$scope.lang);
			}
			else
			{
				$scope.data_loaded = true;

			   // console.log("please login as a sitter");
			}
		}]);
})();