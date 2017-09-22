// Main Angular BabysitterJLM module

console.log = function() {}   // comment out for debugging

var app = angular.module("babysit", ["siteLogin", "signupDetails", "mainPage", "browse-sitters", "sitterDash", "adminPage", "sitterProfile", "headerDir", "parentProfile"]);

var currentLangs = [{'langCode':'en', 'nameField':'englishName', 'displayAs':'English', 'flag' : 'GB'},
                        {'langCode':'he', 'nameField':'hebrewName','displayAs':'עברית', 'flag' : 'IL'}];

app.run(['$rootScope', '$window', '$location', '$cookieStore',
    function($rootScope, $window, $location, $cookieStore) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/signup', '/main']) === -1;
        var loggedIn = $rootScope.user;
        if (restrictedPage && !loggedIn) {
            $location.path('/login/'+rootScope.lang);
        }
    });

    $window.fbAsyncInit = function() {
        FB.init({
            appId: '995124400574977',   // babysitter-backend.appspot.com 
            status: true,
            cookie: true,
            xfbml: true,
            version    : 'v2.10'
        });
    };

  (function(d){
    // load the Facebook javascript SDK

    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));

}]);

app.config(['$routeProvider',
	function($routeProvider){
	    var pageLangs = [];
	    currentLangs.forEach(function(lang){
	        pageLangs.push("/"+lang.langCode);
	    });
		$routeProvider.
		when('/main/:langId?',{
            templateUrl:'partials/pages/main.html',
            controller: 'mainPageCtrl'
        }).
		when('/signup/:langId',{
			templateUrl:'partials/pages/signup-details.html',
			controller:"signupCtrl"
		}).
		when('/sitters/:langId',{
			templateUrl:'partials/pages/browse-sitters.html',
			controller: 'browseSittersCtrl'
		}).
		when('/sitter-dash/:langId',{
			templateUrl:'partials/pages/sitters_dash.html',
			controller: 'sitterDashCtrl'
		}).
		when('/sitter-profile/:langId',{
		    templateUrl:'partials/pages/sitter-profile.html',
		    controller: 'sitterProfileCtrl'
		}).
		when('/jobs/:langId',{
			templateUrl:'partials/pages/sitters_dash.html',
			controller: 'anJobsCtrl'
		}).
		when('/admin',{
			templateUrl:'partials/admin.html',
			controller: 'adminPageCtrl'
		}).
		when('/parents',{
			templateUrl:'partials/pages/browse-jobs.html',
			controller: 'browseSittersCtrl'
		}).
		when('/parent-profile/:langId',{
			templateUrl:'partials/pages/parent-profile.html',
			controller: 'sitterProfileCtrl'
		}).
		when('/login/:langId?',{
			templateUrl:'partials/pages/site-login.html',
			controller: 'loginCtrl',
			controllerAs: 'vm'
		}).
		when('/reset-request/:langId', {
		    templateUrl:'partials/pages/site-reset-request.html',
		    controller: 'loginCtrl',
		    controllerAs: 'vm'
		}).
		when('/reset-sent/:langId', {
		    templateUrl:'partials/pages/site-reset-sent.html',
		    controller: 'loginCtrl',
		    controllerAs: 'vm'
		}).
		when('/reset/:langId/:userId/:resetToken', {
		    templateUrl:'partials/pages/site-reset-pwd.html',
		    controller: 'loginCtrl',
		    controllerAs: 'vm'
		}).
		otherwise({
		    redirectTo: function (routeParams, path, search) {
		        if(pageLangs.indexOf(path)>=0)
		            return "/main"+path;
		        else
                    return "/main";
            }}
		);

}]);

app.service("gapiService", ["$window", function($window){
	this.loadApi = function(scope)
	{
		scope.parent_api_ready = false;
		scope.sitter_api_ready = false;
		scope.sitter_search_api_ready = false;
		scope.job_api_is_ready = false;
		scope.job_search_api_ready = false;
		scope.an_job_search_api_ready = false;
		scope.an_sitter_search_api_ready = false;
		scope.admin_api_ready = false;
		scope.account_api_ready = false;
		scope.connection_api_ready = false;

        // Cloud endpoints does not support custom domains! Hard code it here...
		// FOR HACKATHON and pre deploy testing
		var apiRoot = 'https://babysitter-backend.appspot.com/_ah/api';
		//console.log($window.location.hostname);
		//if ($window.location.hostname == 'localhost' || $window.location.hostname == '127.0.0.1' || (($window.location.port != "") && ($window.location.port > 1023))) {
			// We're probably running against the DevAppServer
		//	apiRoot = 'http://' + $window.location.host + '/_ah/api';
		//}
		gapi.client.load('sitterProfileApi', 'v1', function() {
								 scope.sitter_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('parentProfileApi', 'v1', function() {
								 scope.parent_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('sitterProfileSearchApi', 'v1', function() {
								 scope.sitter_search_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('jobApi', 'v1', function() {
								 scope.job_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('jobSearchApi', 'v1', function() {
								 scope.job_search_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('anonymousJobApi', 'v1', function() {
								 scope.an_job_search_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('anonymousSitterApi', 'v1', function() {
								 scope.an_sitter_search_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('adminProfileApi', 'v1', function() {
								 scope.admin_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
		gapi.client.load('accountSettingsApi', 'v1', function() {
								 scope.account_api_ready = true;
								 scope.$apply();
						 }, apiRoot);
	    gapi.client.load('connectionRequestApi', 'v1', function(){
	                scope.connection_api_ready = true;
                    scope.$apply();
	    }, apiRoot);
	}
}]);

app.controller("babysitCtrl",["$scope", "$window", "$location", '$rootScope', 'gapiService', 'translateService', 'enumService', 'authenticationService', "$routeParams", function($scope, $window, $location, $rootScope, gapiService, translateService, enumService, authenticationService, $routeParams){

    //do we really need to clear creds on reload?
   // authenticationService.clearCredentials();
    $scope.nameFields = {};
    $scope.langCodes = enumService.getPropertyOfEnums("Language", "code");
    currentLangs.forEach(function(lang){
        $scope.nameFields[lang.langCode]=lang.nameField;
    });

	$window.init = function () {
        // Loads the OAuth and app APIs asynchronously, and triggers login
        // when they have completed.
        $scope.$apply($scope.load_api);
       // $scope.$apply($scope.load_user);
    };
    $scope.load_api = function(){
    	gapiService.loadApi($scope);
    };
    $scope.load_user = function(){
        authenticationService.refreshCredentials($scope);
    };
    $scope.setPageLanguage = function(lang)
    {
        if(lang===undefined){
            /*var userLang = navigator.language || navigator.userLanguage;
            if(userLang.startsWith('en'))
                userLang = 'en';
            else
                userLang = 'he';
            var url = $location.path()+"/"+userLang;*/
            var url = $location.path()+"/he";
            $location.path(url);
            return;
        }
        else if($scope.langCodes.indexOf(lang)<0)
        {
            var url = $location.path().slice(1, $location.path().lastIndexOf('/')+1) +'he';
            $location.path(url);
            return;
        }
        else{
            $rootScope.lang = lang;
        }
		$rootScope.default_direction = lang === 'he' ? 'rtl' : 'ltr';
		$rootScope.opposite_direction = lang === 'he' ? 'ltr' : 'rtl';
		$rootScope.default_float = lang === 'he' ? 'right' : 'left';
		$rootScope.opposite_float = lang === 'he' ? 'left' : 'right';
    }
    $scope.getText = translateService.getEnumName;
    $scope.getName = function(enumTypeName, enumName, langId){

        return enumService.getPropertyOfSingleEnum(enumTypeName, enumName, $scope.nameFields[langId]);
    }

    $scope.getNeighborhoodName = function(cityName, enumName, langId){
        if(enumName !== undefined)
        {
            var neighborhoods = enumService.getPropertyOfSingleEnum("City", cityName, "insideNeighborhoods");
            if(neighborhoods){
                for(var i = 0; i<neighborhoods.length; i++)
                {
                    if(neighborhoods[i].name === enumName)
                    {
                        for(objKey in neighborhoods[i])
                        {
                            if(objKey === $scope.nameFields[langId])
                                return neighborhoods[i][objKey];
                        }
                    }
                }
            }
        }
    };
}]);



