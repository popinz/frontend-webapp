(function(){
	var chooseCity = angular.module('chooseCity', ["publicEnumTypes"]);
	chooseCity.service("citiesService", ["enumService",function(enumService){
	    var cities = enumService.getEnumCopy("City");

	    this.getCities = function(city)
	    {
	        var citiesArr = angular.copy(cities);
	        if(city !== 'JERUSALEM')
	        {
	            for(var i = 0; i<citiesArr.length; i++)
                {
                    if(citiesArr[i].name === city)
                    {
                         citiesArr[i].checked = true;
                         {break;}
                    }
                }
	        }
	        return citiesArr;
	    }
	}]);

	chooseCity.directive("chooseCities", ["enumService", "citiesService", function(enumService, citiesService){
        return{
            restrict:'E',
            templateUrl: "partials/directives/chooseCity.html",
            controller: ["$scope", function($scope){
                $scope.cities = citiesService.getCities($scope.sitter.city);
                //calls getCheckedEnumsFromSitter() that returns full array of cities
                //with the sitter's cities prechecked
                $scope.$watch('sitter', function() {
                    if($scope.sitter && $scope.sitter.whereOutside){
                        $scope.cities = enumService.getCheckedEnumsFromSitter($scope.cities, $scope.sitter.whereOutside);
                        //assigns whereOutside array to checkedCities variable
                        //to be displayed as a list of chosen cities
                        $scope.checkedCities = $scope.sitter.whereOutside;
                    }
                });

                //gathers names of checked checkboxes
                //called on popup button click
                $scope.getCheckedCities = function(){
                    $scope.checkedCities = enumService.gatherCheckedEnumNames($scope.cities);
                    if($scope.checkedCities.length===0)
                        $scope.workOutsideTheCity = false;
                };

                //listens to gatherCities event coming from parent
                $scope.$on("gatherCities", function(e){
                    //extract additional arguments for further actions
                     $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                     //publishes gathered event and returns checkedCities to the parent
                     $scope.$emit("gathered", "cities", $scope.checkedCities, $scope.additionalArgs);

                });
            }]
        };
    }]);
})();