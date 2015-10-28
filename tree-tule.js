angular	
	.module('treetule', [])
	.controller('testController', ['$scope', '$http',
		function ($scope, $http){

			$scope.treeTuleConfiguration  = {
				data : [],
				idField : "id",
				codeField : "code",
				childrenField : "accounts",
				descriptionField : "description",
				displayLevel: [0,1,2,3,4,5] //default 1 -- 0 means all (in some future will work)
			}

			$http.get('json.json').success(function(data){
				$scope.treeTuleConfiguration.data = data;
			});
		}
	])
	.directive('treeTule', ['$animate', '$compile', function ($animate, $compile) {
 		return	{ 
 			restrict : 'AE',
 			scope : {
 				"treeTule" : "="
 			},
	 		link: function (scope, element, attrs) {
			    "use strict";
			    //var  ಠ_ಠ = scope.$watchCollection; //hilarious, but not work 

				scope.$watchCollection('treeTule.data', function(){

					if(!scope.treeTule) return;
					if(!scope.treeTule.data) return;

					angular.forEach(scope.treeTule.data, function(node){
						element.append(
							$compile(createListNode(
								node[scope.treeTule.idField],
								node[scope.treeTule.codeField],
								node[scope.treeTule.descriptionField]
							))(scope)
						)
					});
				}, true);	

				scope.clickNode = function (id){
					findRecursive(
						scope.treeTule.data, 
						id, 
						scope.treeTule.idField, 
						scope.treeTule.childrenField,
						function (node) {

							if (!node[scope.treeTule.childrenField].length) return;
	 						var hasList = $("#"+id + ":has(ul)");

							if(!(hasList && hasList.length)	) {
								$("#"+id ).append(document.createElement("ul"))
								angular.forEach(node[scope.treeTule.childrenField], function (node){
									$("#"+id+">ul" ).append(
										$compile(createListNode(
											node[scope.treeTule.idField],
											node[scope.treeTule.codeField],
											node[scope.treeTule.descriptionField]
										))(scope)
									)
								});
								$('.tree-tule li:has(ul)').addClass('parent_li').find(' > span')
								$('.tree-tule li.parent_li > span').each(function(){

									$(this).parent('li.parent_li').find(' > ul > li').hide();
								});
					    		$('.tree li.parent_li > span').on('click', function (e) {
					        		var children = $(this).parent('li.parent_li').find(' > ul > li');
					        		if (children.is(":visible")) {
					            		children.hide('fast');
					        		} else {
					            		children.show('fast');
					        		}
					        		e.stopPropagation();
					    		});
							}
							
						});
				}


				var findRecursive = function (data, id, idField, childrenField, callback){
					var lengthSuperior;
					for (var i = 0, lengthSuperior = data.length; i < lengthSuperior; i++) {
						if (data[i][idField] === id )
						{
							callback(data[i]);
						}	
						if(data[i][childrenField] && data[i][childrenField].length > 0)
							findRecursive(data[i][childrenField], id, idField, childrenField, callback);
					};
				}

				var createListNode = function (id, code, description)
				{
					//var basicTemplateNode = "<li ng-click='clickNode='></li>";

					var li = document.createElement('li');
					var divGroup = document.createElement('div');
					var spanCode = document.createElement('span');
					var divDescrip = document.createElement('div');
					li.id = id;
					divGroup.className = 'input-group';
					divGroup.setAttribute('ng-click', 'clickNode('+ id +')')
					spanCode.className = 'input-group-addon';
					divDescrip.className = 'form-control';
					spanCode.innerHTML = code;
					divDescrip.innerHTML = description;
					divGroup.appendChild(spanCode);
					divGroup.appendChild(divDescrip);
					li.appendChild(divGroup);
					return li;	
				}
			}
		}	
	}]);