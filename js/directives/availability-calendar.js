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
	var availabilityCalendar = angular.module('availabilityCalendar', ['publicEnumTypes', 'translateModule']);


    availabilityCalendar.service('scheduleService', ["enumService", function(enumService){
			var times = enumService.getEnumCopy("Times");
			var scheduleItemsArr = enumService.getEnumCopy("WeekSchedule");
			var i = 0;
			while(i<scheduleItemsArr.length)
			{
				var numOfWeekdays = 7;
				for(var j =0; j<times.length;j++)
				{
					for(var k =0; k<numOfWeekdays; k++)
					{
						if(times[j].weekdays === undefined)
							times[j].weekdays = [];
						times[j].weekdays.push(scheduleItemsArr[i]);
						i++;
					}
				}
				this.times = times;
			}

			this.prefillSchedule = function(scope)
			{
				for(var i=0; i<scope.sitter.schedule.length;i++)
				{
					for(var j=0; j<scope.times.length; j++)
					{
						for(var k=0; k<scope.times[j].weekdays.length; k++)
						{
							if(scope.times[j].weekdays[k].name === scope.sitter.schedule[i])
								scope.times[j].weekdays[k].checked = true;
						}

					}
				}
			}

			this.getUpdate = function(times){
				var numOfWeekdays = 7;
				var schedule = [];
				for(var i=0; i<times.length; i++)
				{
					for(var j=0; j<numOfWeekdays; j++)
					{
						if(times[i].weekdays[j].checked === true)
							schedule.push(times[i].weekdays[j].name);
					}
				}
				return schedule;
			}
    }]);
	availabilityCalendar.directive("availabilityCalendar", ["scheduleService", "translateService", '$rootScope', function(scheduleService, translateService, $rootScope){
    	return{
    		restrict:'E',
    		templateUrl: "partials/directives/availability-calendar.html",
    		/*link: function(scope){
    		    if(scope.sitter.schedule)
                {
                    scheduleService.prefillSchedule(scope);
                }
                if(scope.sitter.calendarValidUntil){
                    scope.calendarValidUntil = new Date(scope.sitter.calendarValidUntil);
                }
    		},*/

    		controller: ["$scope", function($scope){
    			$scope.times = angular.copy(scheduleService.times);
    			for(index in $scope.times){
    			    $scope.times[index].text = translateService.getEnumName($scope.times[index], $rootScope.lang);
    			}
    			$scope.today = new Date();
                $scope.calendarValidUntil = new Date(new Date().setMonth($scope.today.getMonth()+6));

                $scope.$watch("sitter", function(){
                    if($scope.sitter.schedule)
                    {
                        scheduleService.prefillSchedule($scope);
                    }
                    if($scope.sitter.calendarValidUntil){
                        $scope.calendarValidUntil = new Date($scope.sitter.calendarValidUntil);
                    }
                })

				$scope.$on("gatherScheduleUpdate", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //sets $scope.sitter.calendarValidUntil
				    $scope.sitter.calendarValidUntil = $scope.calendarValidUntil;
				    //gathers checked times
					$scope.checkedTimes = scheduleService.getUpdate($scope.times);
				});

				$scope.$watch("checkedTimes", function(){
				    if($scope.checkedTimes !== undefined)
				    {
				        $scope.$emit("gathered", "times", $scope.checkedTimes, $scope.additionalArgs);
				    }

				});
    		}]
    	};
    }]);
})();