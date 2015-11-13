/**
*	Tree-Tule.js 
* Tree for angularjs.
*/
angular	
.module('treetule', [])

.directive('treeTule', ['$compile', '$parse', '$interpolate', function ($compile, $parse, $interpolate) {
	return	{ 
		restrict : 'A',
		scope : {
			"treeTule" : "="
		},
 		link: function (scope, element, attrs) {
		  "use strict";
		  //var  ಠ_ಠ = scope.$watchCollection; //hilarious, but not work 
		  
		  /*
		   *	Every change in the source. 
		   *	In future should make all operations -  now just [C] in (CRUD)
		   */
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

			/*
			* Event that fires when the user click at the node (always <li>)
			*	@id primary key from de source. 
 			*/
			scope.clickNode = function (id) {
				findRecursive(
					scope.treeTule.data, 
					id, 
					scope.treeTule.idField, 
					scope.treeTule.childrenField,
					function (node) {

						if (!node[scope.treeTule.childrenField].length) return;
 						var hasList = $("#"+id + ":has(ul)");

						if(!(hasList && hasList.length))//nodes alredy created
						{
							$("#"+id ).append(document.createElement("ul"));
							angular.forEach(node[scope.treeTule.childrenField], function (node){
								$("#"+id+">ul" ).append(
									$compile(createListNode(
										node[scope.treeTule.idField],
										node[scope.treeTule.codeField],
										node[scope.treeTule.descriptionField]
									))(scope)
								)
							});
							//for animation.
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
					}
				);
			}

			/*
			* Util to find a node in an array of nested objects.
			* @data 						[Object object] - data source nested objects
			* @id 							value to find (primary key)
			*	@idField					property name of primary key
			* @childrenField 		property name of nested objects
			* @callback					callback that fires when find the object.
			*/
			var findRecursive = function (data, id, idField, childrenField, callback) {
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

			/*
			*	Create a node (<li>) with a default template. 
			*	This function is a dummy. replace assing for $parse and $transclusion.
			*	Should make entire node with suport for future features like:
			* 	- buttons
			*	- custom templates
			*	- handle edit
			* @id 
			* @code
			* @decription
			*/
			var createListNode = function (id, code, description)
			{
				var defaultTemplateNode = [
					"<li id='{{id}}'>",
						"<div class='input-group super_parent_li' ng-click='clickNode({{id}})'>" ,
							"<span class='input-group-addon'>{{code}}</span>",
							"<div class='form-control'>{{description}}<div>",
						"<div>",
					"</li>"
				];
				return ($interpolate(defaultTemplateNode.join('')))({
					id: id,
					code: code,
					description: description
				});	
			}
		}
	}	
}]);