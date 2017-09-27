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
	var jobs = angular.module("jobs", ["publicEnumTypes"]);
	jobs.service("jobsService", ["$rootScope", "enumService", function($rootScope, enumService){

		this.prefillJobTypes = function(scope){
			if(scope.sitter.jobType)
			{
				for(var i = 0; i < scope.sitter.jobType.length; i++)
				{
					for(var j = 0; j < scope.jobTypes.length; j++)
					{
						if(scope.sitter.jobType[i] === scope.jobTypes[j].name)
							scope.jobTypes[j].checked = true;
					}
				}
			}
		}

		this.getCheckedJobTypes = function(jobTypes){
			var res = [];
			for(var i = 0; i < jobTypes.length; i++)
			{
				if(jobTypes[i].checked)
					res.push(jobTypes[i].name);
			}
			return res;
		}
		this.jobsResult = function(scope, filters){
			var numOfResultsPerPage = 10;
			if($rootScope.user !== {} && $rootScope.user.userType === "sitter")
			{
			    console.log($rootScope.user.id + "; " + $rootScope.user.creds.token);
				var searchInstance = {'id': $rootScope.user.id, 'logInToken': $rootScope.user.creds.token, 'numOfResultsPerPage': numOfResultsPerPage};
				$.extend(searchInstance, filters);
				gapi.client.jobSearchApi.getJobSearch(searchInstance).execute(function(response){
					console.log(response);
					if (response.result && !response.error)
					{
					    scope.jobs = response.results;
                        scope.$apply();
					}
				});
			}
			else
			{
				gapi.client.anonymousJobApi.getAnonymousJobSearch({'id': 0, 'numOfResultsPerPage': numOfResultsPerPage}).execute(function(response){
					console.log(response);
					scope.jobs = response.results;
					scope.$apply();
				});
			}
		}
	}]);

	jobs.directive("jobsTable", ["jobsService", "enumService", function(jobsService, enumService){
    	return{
    		restrict:'E',
    		templateUrl: "partials/jobs-table.html",
    		controller: ["$scope", "$rootScope", function($scope, $rootScope){
    			$scope.$watchGroup(["data_loaded", "job_search_api_ready", "an_job_search_api_ready"], function(){
    				if($scope.data_loaded && $scope.job_search_api_ready && $scope.an_job_search_api_ready)
    				{
    					//here we should take user preferences from his/her account
    					//and use them as default filters
    					//DELETE ARMON_HANATZIV later
    					// PROBLEM: neighborhoodWork is an array, but we can't pass array
    					// as a search parameter for neighborhoods
    					jobsService.jobsResult($scope, {'neighborhood': ["ARMON_HANATZIV"]});
    				}
    			})
                //use function from ang-babysit.js
    			$scope.getEnglishName = function(enumTypeName, enumName){
                		return enumService.getPropertyOfSingleEnum(enumTypeName, enumName, "englishName");
                }
                $scope.getNeighborhoodEnglishName = function(cityName, enumName){
                	if(enumName !== undefined)
                	{
                		var neighborhoods = enumService.getPropertyOfSingleEnum("City", cityName, "insideNeighborhoods");
                        for(var i = 0; i<neighborhoods.length; i++)
                        {
                        	if(neighborhoods[i].name === enumName)
                        	{
                        		return neighborhoods[i].englishName;
                        	}
                        }

                	}
                };
    		}]
    	};
    }]);
})();