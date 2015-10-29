angular	
.module('treetule', [])
.directive('treeTule', ['$compile', function ($compile) {
	return	{ 
		restrict : 'A',
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
						}		


						if (!$('#' + id + ':has(ul)').hasClass('parent_li') || $('#' + id + ':has(ul)').hasClass('super_parent_li') ) 
						{
	                        $('#' + id + ':has(ul)').addClass('parent_li');

	                        $('#' + id + '>div').on('click', function (e) {
	                            var children = $(this).parent('li.parent_li').find(' > ul > li');
	                            if (children.is(":visible")) {
	                                children.hide('fast');
	                            } else {
	                                children.show('fast');
	                            }
	                            e.stopPropagation();
	                        });
                    	}

					}
				);
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
				divGroup.className = 'input-group super_parent_li';
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