angular	
	.module('appTest', ['treetule'])
	.controller('testController', ['$scope', '$http',
		function ($scope, $http){

			$scope.treeTuleConfiguration  = {
				data : [],
				idField : "id",
				codeField : "code",
				childrenField : "accounts",
				descriptionField : "description",
				displayLevel: [0,1,2,3,4,5], //default 1 -- 0 means all (in some future will work)
				buttons: {
					create : {
						display : true, // true - default
						main : true // default
					},
					del : {
						display : true // true default
					},
					customs : [
						{
							name : "asdfasd",
							icon : "",
							firesWhen : function(s){

							},
							excluyente : "fieldJson"
						}
					]
				},
				maxLevelCreate : ""

			}

			$http.get('json.json').success(function(data){
				$scope.treeTuleConfiguration.data = data;
			});
		}
	]);