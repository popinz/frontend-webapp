(function(){
	var publicEnumTypes = angular.module("publicEnumTypes", []);
	publicEnumTypes.service("enumService", function(){
		this.getEnum = function(enumName) {
        	return enumTypes[enumName];
        }

        this.getEnumCopy = function(enumName) {
            return angular.copy(enumTypes[enumName]);
        }

        //Not sure we need getPropertyOfEnums() because it's the job angular expressions do for us
        //do we ever use it?
        this.getPropertyOfEnums = function(enumTypeName, field) {
        	var array = [];
        	var enums = enumTypes[enumTypeName];
        	for (var i = 0; i< enums.length; i++) {
        	    for(objKey in enums[i])
        	    {
        	        if(objKey === field)
        	        {
        	            var res = enums[i][objKey];
        	            if(res, res !== undefined, res !== '')
        	                array.push(res);
        	        }
        	    }
        	}
        	return array;
        }

        this.getPropertyOfSingleEnum = function(enumTypeName, enumName, field) {
        	var enums = enumTypes[enumTypeName];
        	for (var i = 0; i < enums.length; i++) {
        		var obj = enums[i];
        		if (obj.name === enumName) {
        			for(objKey in obj)
        			{
        				if(objKey === field)
        					return angular.copy(obj[objKey]);
        			}
        		}
        	}
        	return undefined;
        }

        this.gatherCheckedEnumNames = function(enumArray)
        {
        	var res = [];
        	if(enumArray)
        	{
        		for(var i = 0; i < enumArray.length; i++)
				{
					if(enumArray[i].checked)
						res.push(enumArray[i].name);
				}
        	}
			return res;
        }

        /*this.gatherSelectedEnumNames = function(array, enumName)
        {
            var enumArray = this.getEnum(enumName);
            console.log("array: " + array.length);
            console.log(enumArray);
            console.log("enumArray: " + enumArray.length);
        	var res = [];
        	if(array) {
        		for(var i = 0; i < array.length; i++) {
                    console.log("enum: " + array[i].option);
					if(enumArray.indexOf(array[i].option) != -1 && array[i].option.selected)
						res.push(array[i].option);
				}
        	}
			return res;
        }*/

        this.getCheckedEnumsFromSitter = function(fullArray, sitterArray){
            if(sitterArray){
                for(var i = 0; i < sitterArray.length; i++){
                    for(var j = 0; j < fullArray.length; j++){
                        if(fullArray[j].name === sitterArray[i]){
                            fullArray[j].checked = true;
                        }
                    }
                }
            }
            return fullArray;
        }
	});
})();