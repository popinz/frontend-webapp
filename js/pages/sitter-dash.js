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