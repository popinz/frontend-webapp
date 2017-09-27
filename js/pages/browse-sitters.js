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
	var browseSitters = angular.module('browse-sitters', ['ngRoute', 'infinite-scroll', "publicEnumTypes", "miniProfile", "alertsModule", 'saveFiltersModule']);
	browseSitters.service("sittersSearchService", ["$rootScope", "alertsService", "$window", function($rootScope, alertsService, $window){
	    var self = this;
	    var numOfResultsPerPage = 6;

	    this.getFilteredSittersAnonymous = function(searchInstance, scope){
	        if (searchInstance.id){
	            gapi.client.anonymousSitterApi.getAnonymousSitter(searchInstance).execute(function(response){
	                if(response.result && !response.error){
	                    scope.sitters = [response.result];
	                    scope.sitters_loaded = true;
                        if(!scope.sitters)
                            scope.nooneFound = true;
                        scope.$apply();
                        if(!angular.equals({}, scope.sitters))
                            self.scrollTo("");
	                }
	            })
	        }
	        else{
                gapi.client.anonymousSitterApi.getAnonymousProfileSearch(searchInstance).execute(function (response) {
                    if(response.result && !response.error)
                    {
                        self.setSitters(scope, response);
                        scope.$apply();
                    }
                });
            }
        }

        this.getFilteredSittersRegistered = function(searchInstance, scope){
            gapi.client.sitterProfileSearchApi.getProfileSearch(searchInstance).execute(function (response) {
                if(response.result && !response.error)
                {
                    self.setSitters(scope, response);
                    scope.$apply();
                }
            });
        }

        this.scrollTo = function(id){
            var scrollY = $("#profile-"+id).offset().top;
            $window.scrollTo(0, scrollY);
        }

        this.setSitters = function(scope, response){
            scope.sitters = response.results;
            scope.result = response.result;
            delete scope.result["results"];
            scope.sitters_loaded = true;
            if(!scope.sitters)
                scope.nooneFound = true;
        }

		this.loadSittersInParentsArea = function(scope, filters){
			if($rootScope.user.creds && !angular.equals({}, $rootScope.user.creds.accountId))
			{
				var searchInstance = $.extend({}, $rootScope.user.creds, {'numOfResultsPerPage': numOfResultsPerPage});
				if(jQuery.isEmptyObject(filters))
				{
					if($rootScope.user.userType === "parent")
					{
					    gapi.client.parentProfileApi.getParentProfile($rootScope.user.creds).execute(function(response){
                            if (response.result && !response.error){
                                scope.parent = response.result;
                                if(scope.parent.city === "JERUSALEM" && scope.parent.neighborhood){
                                    $.extend(searchInstance, {'neighborhood':scope.parent.neighborhood}) ;
                                    $.extend(searchInstance, {'neighborhoodsWork':[scope.parent.neighborhood]}) ;
                                    // $.extend(searchInstance, {'locationInsideJlm':[scope.parent.neighborhood]}) ;
                                    scope.sitter.city = "JERUSALEM";
                                    scope.sitter.neighborhood = scope.parent.neighborhood;
                                    // scope.sitter.locationInsideJlm = [scope.parent.neighborhood];
                                    scope.$apply();
                                    self.getFilteredSittersRegistered(searchInstance, scope);
                                }
                                else if(scope.parent.city && scope.parent.city !== "JERUSALEM"){
                                    $.extend(searchInstance, {'city':scope.parent.city}) ;
                                    $.extend(searchInstance, {'whereOutside':[scope.parent.city]}) ;
                                    // $.extend(searchInstance, {'locationOutsideJlm':[scope.parent.city]}) ;
                                    scope.sitter = {city : scope.parent.city};
                                    // scope.sitter.locationOutsideJlm = [scope.parent.city];
                                    scope.$apply();
                                    self.getFilteredSittersRegistered(searchInstance, scope);
                                }
                                else
                                    $('#chooseYourCityModal').modal();
                            }
                            else{
                                alertsService.showAlert(response.error.message);
                            }
                        });
					}
					else
					    self.getFilteredSittersRegistered(searchInstance, scope);

				}
				else{
                    $.extend(searchInstance, filters);
                    self.getFilteredSittersRegistered(searchInstance, scope);
				}
			}
			else
			{
				var searchInstance = {'accountId': 0, 'numOfResultsPerPage': numOfResultsPerPage};
				$.extend(searchInstance, filters);
				self.getFilteredSittersAnonymous(searchInstance, scope);
			}
		};

		this.loadNextSitters = function(scope){

			if(scope.result !== undefined && scope.result.totalNumOfResults > scope.result.offsetInSearch)
			{
				scope.busy = true;
				if($rootScope.user !== {} && ($rootScope.user.userType === "parent" || $rootScope.user.userType === "sitter")){
					gapi.client.sitterProfileSearchApi.getProfileSearch(scope.result).execute(function (response) {
						if (response.result && !response.error)
						{
							scope.result.offsetInSearch = response.offsetInSearch;
							scope.sitters = scope.sitters.concat(response.results);
							scope.busy = false;
							scope.$apply();
						}
					   });
				}
				else
				{
					gapi.client.anonymousSitterApi.getAnonymousProfileSearch(scope.result).execute(function (response) {
						if (response.result && !response.error)
						{
							scope.result.offsetInSearch = response.offsetInSearch;
							if (scope.sitters !== null) {
							    scope.sitters = scope.sitters.concat(response.results);
							}
							scope.busy = false;
							scope.$apply();
						}
					   });
				}
			}
		}
		this.langFilter = function(languages){
			var langFilter = [];
			for(var i = 0; i < languages.length; i++)
			{
				if(languages[i].checked === true)
				{
					langFilter.push(languages[i].name);
				}
			}
			return langFilter;
		}
	}]);

	browseSitters.controller("browseSittersCtrl",["$scope","$routeParams", "$rootScope", "$location", "$anchorScroll", "enumService", "sittersSearchService", "enumService", 'saveFiltersService', 'alertsService', '$timeout', function($scope, $routeParams, $rootScope, $location, $anchorScroll, enumService, sittersSearchService, enumService, saveFiltersService, alertsService, $timeout){
        $scope.sitter={language:''};
		//Language switch
        $scope.setPageLanguage($routeParams.langId);
		$scope.cities = enumService.getEnumCopy("City");
		$scope.languages = enumService.getEnum("Language");
		$scope.search = 'location';

		var timer1;
		var timer2;

        $scope.savePlace = function(){
            if($scope.sitter.city === "JERUSALEM" && !$scope.sitter.neighborhood)
                return;
            var parent =$.extend({}, $scope.parent, $rootScope.user.creds, {'city' : $scope.sitter.city, 'neighborhood' : $scope.sitter.neighborhood});
            gapi.client.parentProfileApi.updateParentProfile(parent).execute(function(response){
                if (response.result && !response.error){
                    var filter = $scope.createLocationFilter(parent.city, parent.neighborhood);
                    var searchInstance = $.extend({}, $rootScope.user.creds, filter);
                    sittersSearchService.getFilteredSittersRegistered(searchInstance, $scope);
                    $('#chooseYourCityModal').modal("hide");
                }
                else{
                    alertsService.showAlert(response.error.message);
                }
            });
        }

		$scope.getNextSitters = function(){
			sittersSearchService.loadNextSitters($scope);
		}


		$scope.$watchGroup(['sitter_api_ready', 'sitter_search_api_ready', "an_sitter_search_api_ready", "parent_api_ready"], function() {
            if($scope.sitter_api_ready  === true && $scope.sitter_search_api_ready === true &&
                $scope.an_sitter_search_api_ready === true && $scope.parent_api_ready === true)
            {
                //uncomment the code for creating test profiles
               /* gapi.client.sitterProfileApi.setupTestSitterProfile({"numProfiles" : 200}).execute(function(response){
                if(response.error)
                    console.log(response.error.message);*/

                var search = Object.keys($location.search())[0];
                var savedFilters = saveFiltersService.getFilters();
                if(search){
                    sittersSearchService.getFilteredSittersAnonymous({'accountId' : 0, 'id': search}, $scope);
                }
                else if(savedFilters){
                    timer1 = $timeout(function(){
                        $scope.sitter = savedFilters.filters;
                        saveFiltersService.emptyFilters();
                        $scope.sitters = savedFilters.results;
                        $scope.result = savedFilters.searchInstance;
                        $scope.sitters_loaded = true;
                    }, 0);
                    timer2 = $timeout(function(){
                        sittersSearchService.scrollTo(savedFilters.id);
                    }, 1);
                }
                else{
                    sittersSearchService.loadSittersInParentsArea($scope, {});
                }
               // })
            }
		});

        $scope.applyFilters = function(){
            if($scope.sitter_api_ready  === true && $scope.sitter_search_api_ready === true && $scope.an_sitter_search_api_ready === true && $scope.parent_api_ready === true){
                var filters={'applied' : true};
                $scope.sitters = null;
                $scope.nooneFound = $scope.sitters_loaded = false;
                $.extend(filters, $scope.createLocationFilter($scope.sitter.city, $scope.sitter.neighborhood));
                filters = $scope.addLangToFilter(filters, $scope.sitter.language);
                sittersSearchService.loadSittersInParentsArea($scope, filters);
            }
        };

        $scope.addLangToFilter = function(filters, lang){
            if(lang && lang != "") {
                $.extend(filters, {"firstLang":lang});
                $.extend(filters, {"secondLang":lang});
                $.extend(filters, {"thirdLang":lang});
                $.extend(filters, {"languages":[lang]});
            }
            else if(filters.languages) {
                delete filters.firstLang;
                delete filters.secondLang;
                delete filters.thirdLang;
                delete filters.languages;
            }
            return filters;
        }

        $scope.createLocationFilter = function(city, neighborhood){
            var filters={};
            if(city === "JERUSALEM" && neighborhood) {
                $.extend(filters, {'neighborhood':neighborhood});
                $.extend(filters, {'neighborhoodsWork':[neighborhood]});
                // $.extend(filters, {'locationInsideJlm':[neighborhood]});
            }
            else if(city && city !== "JERUSALEM") {
                $.extend(filters, {'city':city});
                $.extend(filters, {'whereOutside':[city]});
                // $.extend(filters, {'locationOutsideJlm':[city]});
            }
            return filters;
        }

        $scope.$on("saveFilters", function(event, clickedSitter){
            saveFiltersService.saveFilters($scope.sitter, $scope.sitters, $scope.result, clickedSitter);
        })

        $scope.$on("$destroy", function() {
            if( timer1 )
                $timeout.cancel( timer1 );
            if( timer2 )
                $timeout.cancel( timer2 );
        });

        $scope.disableSelects = function(){
            if($scope.search == 'location'){
                $scope.disableLangs = true;
                $scope.disableLocation = false;
                $scope.sitter.language = "";
            }
            else if($scope.search == 'language'){
                $scope.sitter.city = "";
                $scope.sitter.neighborhood = "";
//                $scope.sitter.locationInsideJlm = [];
//                $scope.sitter.locationOutsideJlm = [];
            }
        }
    }]);
})();
