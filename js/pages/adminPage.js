(function(){
	var adminPage = angular.module('adminPage', []);
	adminPage.service("adminService", function(){
		this.getLogInToken = function(scope)
		{
			gapi.client.adminProfileApi.getLogInTokenOfProfile({
				'email': scope.loginAdminText.email,
				'password': scope.loginAdminText.password
			}).execute(function (response) {
				console.log(response);
				 if (response.result && !response.error)
				{
					scope.reqEmail = response.email;
					scope.reqLoginToken = response.logInToken;
					scope.$apply();

                    this.loginAdmin = function(scope)
                    {
                        gapi.client.adminProfileApi.logInAdmin({
                            'accountId': scope.reqEmail,
                            'token': scope.reqLoginToken,
                            'tokenType': "SITE"
                        }).execute(function (response) {
                            console.log(response);
                             if (response.result && !response.error)
                            {
                                scope.shouldShowLogin = false;
                                scope.shouldShowAdmin = true;
                                scope.reqEmail = response.email;
                                scope.reqAccountId = response.email;
                                scope.$apply();
                            }
                            else
                            {
                                scope.errors.push(response.error);
                                scope.$apply();
                            }
                        });
                    }
			        loginAdmin(scope);
				}
				else
				{
					scope.errors.push(response.error);
					scope.$apply();
				}
			});
		}
		this.insertAdmin = function(scope)
		{
			gapi.client.adminProfileApi.signUpAdminProfile({
				'accountId': scope.adminSignUp.email,
				'token': scope.adminSignUp.password,
				'tokenType': "SITE",
				'reqAccountId': scope.reqEmail,
				'reqToken': scope.reqLoginToken,
				'reqTokenType': "SITE",
				'email': scope.adminSignUp.email,
				'password': scope.adminSignUp.password
			}).execute(function (response) {
				 console.log(response);
				 if (response.result && !response.error)
				{
//					scope.profiles.push(response);
//					//You will need to call $apply() to apply the model change to the UI,
//					//since the callback function is called from outside of the controller thread
//					scope.$apply();
				}
				else
				{
			        var para = document.createElement("p");
                    var node = document.createTextNode(response.error.data[0].message);
                    para.id = "adminSignUpDivError";
                    para.appendChild(node);
                    var adminSignUpDiv = document.getElementById("adminSignUpDiv");
			        adminSignUpDiv.appendChild(para);
					scope.errors.push(response.error);
					scope.$apply();
				}
			});
		}
		this.deleteProfile = function(scope, accountId)
		{
			gapi.client.adminProfileApi.deleteProfile({
				'accountId': accountId,
				'tokenType': "SITE",
				'reqAccountId': scope.reqEmail,
				'reqToken': scope.reqLoginToken,
				'reqTokenType': "SITE"
			}).execute(function (response) {
				console.log(response);
				 if (response.result && !response.error)
				{
//					scope.profiles.push(response);
//					//You will need to call $apply() to apply the model change to the UI,
//					//since the callback function is called from outside of the controller thread
//					scope.$apply();
				}
				else
				{
					scope.errors.push(response.error);
					scope.$apply();
				}
			});
		}
		this.updateProfile = function(scope, enumService, fieldsArray, profileType)
		{
			if (profileType == "ADMIN"){
				gapi.client.adminProfileApi.updateAdminProfile({
					'accountId': fieldsArray["email"],
					'token': fieldsArray["password"],
					'tokenType': "SITE",
					'reqAccountId': scope.reqEmail,
					'reqToken': scope.reqLoginToken,
					'reqTokenType': "SITE",
					'id': fieldsArray["id"],
					'email': fieldsArray["email"],
					'password': fieldsArray["password"],
					'phoneNumberPrefix': fieldsArray["phoneNumberPrefix"],
					'phoneNumberSuffix': fieldsArray["phoneNumberSuffix"],
					'firstNameHe': fieldsArray["firstNameHe"],
					'lastNameHe': fieldsArray["lastNameHe"],
					'firstNameEn': fieldsArray["firstNameEn"],
					'lastNameEn': fieldsArray["lastNameEn"],
					'maxPrice': fieldsArray["maxPrice"],
					'minPrice': fieldsArray["minPrice"],
					//todo add lists to the update
					'languages': fieldsArray["languages"],
					'img': fieldsArray["img"],
					'howHeard': fieldsArray["howHeard"],
					'agreedToTerms': fieldsArray["agreedToTerms"],
					'signedToNewsletter': fieldsArray["signedToNewsletter"],
					'city': fieldsArray["city"],
					'neighborhood': fieldsArray["neighborhood"],
					'street': fieldsArray["street"],
					'homeNumber': fieldsArray["homeNumber"],
					'zipCode': fieldsArray["zipCode"],
					'logInToken': fieldsArray["logInToken"],
					'fbToken': fieldsArray["fbToken"],
					'numOfReviews': fieldsArray["numOfReviews"],
					'rank': fieldsArray["rank"]
				}).execute(function (response) {
					console.log(response);
					 if (response.result && !response.error) {
					    if (scope.reqEmail == response.email) {
					        scope.reqLoginToken = response.logInToken;
					    }
					} else {
						scope.errors.push(response.error);
						scope.$apply();
					}
				});
			}
			if (profileType == "SITTER"){
				gapi.client.adminProfileApi.updateSitterProfile({
					'accountId': fieldsArray["email"],
					'token': fieldsArray["password"],
					'tokenType': "SITE",
					'reqAccountId': scope.reqEmail,
					'reqToken': scope.reqLoginToken,
					'reqTokenType': "SITE",
					'id': fieldsArray["id"],
					'email': fieldsArray["email"],
					'password': fieldsArray["password"],
					'phoneNumberPrefix': fieldsArray["phoneNumberPrefix"],
					'phoneNumberSuffix': fieldsArray["phoneNumberSuffix"],
					'firstNameHe': fieldsArray["firstNameHe"],
					'lastNameHe': fieldsArray["lastNameHe"],
					'firstNameEn': fieldsArray["firstNameEn"],
					'lastNameEn': fieldsArray["lastNameEn"],
					'maxPrice': fieldsArray["maxPrice"],
					'minPrice': fieldsArray["minPrice"],
					//todo add lists to the update
					'languages': fieldsArray["languages"],
					'img': fieldsArray["img"],
					'howHeard': fieldsArray["howHeard"],
					'agreedToTerms': fieldsArray["agreedToTerms"],
					'signedToNewsletter': fieldsArray["signedToNewsletter"],
					'city': fieldsArray["city"],
					'neighborhood': fieldsArray["neighborhood"],
					'street': fieldsArray["street"],
					'homeNumber': fieldsArray["homeNumber"],
					'zipCode': fieldsArray["zipCode"],
					'logInToken': fieldsArray["logInToken"],
					'fbToken': fieldsArray["fbToken"],
					'numOfReviews': fieldsArray["numOfReviews"],
					'rank': fieldsArray["rank"],
					'gender': fieldsArray["gender"],
					'aboutMeHeb': fieldsArray["aboutMeHeb"],
					'experienceStringHeb': fieldsArray["experienceStringHeb"],
					'aboutMeEn': fieldsArray["aboutMeEn"],
					'experienceStringEn': fieldsArray["experienceStringEn"],
					'skills': fieldsArray["skills"],
					'firstAid': fieldsArray["firstAid"],
					'offerings': fieldsArray["offerings"],
					'experience': fieldsArray["experience"],
					'homeworkHelp': fieldsArray["homeworkHelp"],
					'classification': fieldsArray["classification"],
					'references': fieldsArray["references"],
					'schedule': fieldsArray["schedule"],
					'calendarValidUntil': fieldsArray["calendarValidUntil"],
					'workOutsideTheCity': fieldsArray["workOutsideTheCity"],
					'whereOutside': fieldsArray["whereOutside"],
					'neighborhoodsWork': fieldsArray["neighborhoodsWork"],
					'jobType': fieldsArray["jobType"]
				}).execute(function (response) {
					console.log(response);
					 if (response.result && !response.error)
					{}
					else
					{
						scope.errors.push(response.error);
						scope.$apply();
					}
				});
			}
			if (profileType == "PARENT"){
				gapi.client.adminProfileApi.updateParentProfile({
					'accountId': fieldsArray["email"],
					'token': fieldsArray["password"],
					'tokenType': "SITE",
					'reqAccountId': scope.reqEmail,
					'reqToken': scope.reqLoginToken,
					'reqTokenType': "SITE",
					'id': fieldsArray["id"],
					'email': fieldsArray["email"],
					'password': fieldsArray["password"],
					'phoneNumberPrefix': fieldsArray["phoneNumberPrefix"],
					'phoneNumberSuffix': fieldsArray["phoneNumberSuffix"],
					'firstNameHe': fieldsArray["firstNameHe"],
					'lastNameHe': fieldsArray["lastNameHe"],
					'firstNameEn': fieldsArray["firstNameEn"],
					'lastNameEn': fieldsArray["lastNameEn"],
					'maxPrice': fieldsArray["maxPrice"],
					'minPrice': fieldsArray["minPrice"],
					//todo add lists to the update
					'languages': fieldsArray["languages"],
					'img': fieldsArray["img"],
					'howHeard': fieldsArray["howHeard"],
					'agreedToTerms': fieldsArray["agreedToTerms"],
					'signedToNewsletter': fieldsArray["signedToNewsletter"],
					'city': fieldsArray["city"],
					'neighborhood': fieldsArray["neighborhood"],
					'street': fieldsArray["street"],
					'homeNumber': fieldsArray["homeNumber"],
					'zipCode': fieldsArray["zipCode"],
					'logInToken': fieldsArray["logInToken"],
					'fbToken': fieldsArray["fbToken"],
					'numOfReviews': fieldsArray["numOfReviews"],
					'rank': fieldsArray["rank"],
					'spouseName': fieldsArray["spouseName"],
					'secondEmail': fieldsArray["secondEmail"],
					'homePhoneNumberPrefix': fieldsArray["homePhoneNumberPrefix"],
					'homePhoneNumberSuffix': fieldsArray["homePhoneNumberSuffix"],
//					'kidsInfo': fieldsArray["kidsInfo"],
					'numberOfChildren': fieldsArray["numberOfChildren"],
					'pets': fieldsArray["pets"],
					'otherPets': fieldsArray["otherPets"],
					'aboutUs': fieldsArray["aboutUs"],
					'generalRequirements': fieldsArray["generalRequirements"]
				}).execute(function (response) {
					console.log(response);
					 if (response.result && !response.error)
					{}
					else
					{
						scope.errors.push(response.error);
						scope.$apply();
					}
				});
			}
		}
		this.getProfile = function(scope, index)
		{
			gapi.client.adminProfileApi.getProfile({
				'accountId': scope.getProfile.email,
				'tokenType': "SITE",
				'reqAccountId': scope.reqEmail,
				'reqToken': scope.reqLoginToken,
				'reqTokenType': "SITE"
			}).execute(function (response) {
				console.log(response);
				 if (response.result && !response.error)
				{}
				else
				{
					scope.errors.push(response.error);
					scope.$apply();
				}
			});
		}
		this.profileSearch = function(scope, email, firstNameHe, lastNameHe, firstNameEn, lastNameEn)
		{
			gapi.client.adminProfileApi.profileSearch({
				'accountId': scope.reqAccountId,
				'token': scope.reqLoginToken,
				'tokenType': "SITE",
				'email': email,
				'firstNameHe': firstNameHe,
				'lastNameHe': lastNameHe,
				'firstNameEn': firstNameEn,
				'lastNameEn': lastNameEn
			}).execute(function (response) {
				console.log(response);
				 if (response.result && !response.error)
				{
					scope.profiles = response.result.items;
					//You will need to call $apply() to apply the model change to the UI,
					//since the callback function is called from outside of the controller thread
					scope.$apply();
				}
				else
				{
					scope.errors.push(response.error);
					scope.$apply();
				}
			});
		}
		this.setupTestAdminProfile = function(scope, index)
		{
			gapi.client.adminProfileApi.setupTestAdminProfile({
				'numProfiles': scope.createProfile.numProfiles
			}).execute(function (response) {
			    console.log(response);
                var para = document.createElement("p");
                var node = document.createTextNode("Signed up all admins and sitters");
                para.id = "setupTestAdminProfileText";
                para.appendChild(node);
                var adminSignUpDiv = document.getElementById("setupTestAdminProfileDiv");
                adminSignUpDiv.appendChild(para);
			});
		}
	});

	adminPage.controller("adminPageCtrl", ["$scope", "adminService", "enumService", function($scope, adminService, enumService){
		//$scope is the binding part between the view and the controller
		//everything we want to use in Angular expressions in HTML should be in $scope
		$scope.profiles = [];
		$scope.errors = [];
		$scope.shouldShowLogin = true;
		$scope.shouldShowAdmin = false

		$scope.loginAdmin = function(){
			adminService.getLogInToken($scope);
		}

		$scope.addAdmin = function(){
			adminService.insertAdmin($scope);
		}

		$scope.deleteProfile = function(accountId){
			adminService.deleteProfile($scope, accountId);
		}

		$scope.updateProfile = function(index, profileType){
			var fields = document.getElementsByClassName("editRow");
			var fieldsArray = [];
			for (var i = 0; i < fields.length; i++) {
			    if (fields[i].children[1].childNodes[0].tagName === 'SELECT') {
                    var list = fields[i].children[1].childNodes[0];
			        if (fields[i].children[1].childNodes[0].multiple) {
                        console.log("multy");
                        fieldsArray[fields[i].children[0].innerHTML] = [];
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].selected) {
                                fieldsArray[fields[i].children[0].innerHTML].push(list[j].innerHTML);
                            }
                        }
                    } else {
                        console.log("not multy");
                        var j = 0;
                        var key = false
                        while (j < list.length && !key) {
                            if (list[j].selected) {
                                fieldsArray[fields[i].children[0].innerHTML] = list[j].innerHTML;
                                key = true;
                            }
                            j++;
                        }
                    }
				} else {
			        console.log(fields[i].children[1].innerHTML);
				    fieldsArray[fields[i].children[0].innerHTML] = fields[i].children[1].innerHTML.trim();
				}
			}
			adminService.updateProfile($scope, enumService, fieldsArray, profileType);
		}

		$scope.getProfile = function(accountId){
			adminService.getProfile($scope, accountId);
		}

		$scope.profileSearch = function(){
			$scope.profiles = [];
        	$('.editRow').remove();
        	var email, firstNameHe, lastNameHe, firstNameEn, lastNameEn;
        	if ($scope.profileSearchInput.email != "") {
        		email = $scope.profileSearchInput.email;
        	}
        	if ($scope.profileSearchInput.firstNameHe != "") {
        		firstNameHe = $scope.profileSearchInput.firstNameHe;
        	}
        	if ($scope.profileSearchInput.lastNameHe != "") {
        		lastNameHe = $scope.profileSearchInput.lastNameHe;
        	}
        	if ($scope.profileSearchInput.firstNameEn != "") {
        		firstNameEn = $scope.profileSearchInput.firstNameEn;
        	}
        	if ($scope.profileSearchInput.lastNameEn != "") {
        		lastNameEn = $scope.profileSearchInput.lastNameEn;
        	}
			adminService.profileSearch($scope, email, firstNameHe, lastNameHe, firstNameEn, lastNameEn);
		}

		$scope.setupTestAdminProfile = function(){
			adminService.setupTestAdminProfile($scope);
		}

        $scope.editText = function(index){
        	$('.editRow').remove();
			var table = document.getElementById("table");
			var profile = $scope.profiles[index].searchResult;
            var cellElem = document.createTextNode("");
			table = addNewRow(index, "password", table, cellElem);
			var i = 1;
			for(var key in profile) {
                var cellElem;
                var enumList = isFieldEnumList(key);
                if (enumList != undefined) {
                    cellElem = document.createElement("SELECT");
                    var multiple = false;
                    if (profile[key].constructor === Array) {
                        cellElem.multiple = true;
                        multiple = true;
                    }
                    for (var j = 0; j < enumList.length; j++) {
                        var option = document.createElement("OPTION");
                        option.text = enumList[j].name;
                        if (profile[key].indexOf(enumList[j].name) != -1) {
                            option.selected = true;
                        }
                        cellElem.add(option);
                    }
                    if (!multiple) {
                        cellElem.value = profile[key];
                    }
                } else {
                    cellElem = document.createTextNode(profile[key]);
				}
			    table = addNewRow(index + i, key, table, cellElem);
				i++;
            }
		}

        function addNewRow(index, key, table, cellElem) {
			var row = table.insertRow(index + 2);
			row.className = "editRow";
		    row.style.textAlign = "center";
            row.style.border = "solid #000000";
            var cell1 = row.insertCell(0);
            cell1.innerHTML = key;
            cell1.style.border = "solid #000000";
            var cell2 = row.insertCell(1);
            cell2.style.border = "solid #000000";
            cell2.appendChild(cellElem);
            cell2.contentEditable = true;
            cell2.id = "row-" + key;
            return table;
        }

		function isFieldEnumList(key) {
		    var enumKey;
		    switch(key) {
                case "languages":
                    return enumService.getEnum("Language");

                case "neighborhood":
                    return enumService.getPropertyOfSingleEnum("City", "JERUSALEM", "insideNeighborhoods");

                case "schedule":
                    return enumService.getEnum("WeekSchedule");

                case "whereOutside":
                    return enumService.getEnum("City");

                case "neighborhoodsWork":
                    return enumService.getPropertyOfSingleEnum("City", "JERUSALEM", "insideNeighborhoods");

		    }
            var enumKey = key.charAt(0).toUpperCase() + key.slice(1);
            return enumService.getEnum(enumKey);
		}
    }]);
})();