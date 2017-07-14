fui.define('core/parse',function( module ){

	'use strict';
	
	var $ = fui.dom;
	
	
	var _doParse = function(node) {

		var nodeName = node[0].nodeName.toLowerCase();
		
		if (!nodeName){
			return;
		};

		var classNames = node.attr('class');
		var obj = fui.get(node);

		if (classNames && !obj) {
			var classNameArr = classNames.split(" ");
			$(classNameArr).each(function(){
				var _class = fui.getClassByUICls(this);
				if (_class) {
					var D = new _class();
					fui.applyTo.call(D, node);
					node = D.el;
					return D;
				}
			})
		};


		if (
			nodeName == "select"
			|| node.hasClass('fui-menu')
			|| node.hasClass('fui-table')
			|| node.hasClass('fui-treegrid')
			|| node.hasClass('fui-tree')
			|| node.hasClass('fui-button')
			|| node.hasClass('fui-textbox')
			|| node.hasClass('fui-buttonedit')
		){
			return;
		};
		

		var children = node.find('[class]')

		children.each(function(){
			
			_doParse($(this));
		})
	};


	var parse = function(node) {
		
		if (node && !node.nodeType) {
			node = node.el;
		}

		if (typeof node == "string") {
			node = document.getElementById(node);
		}
		
		if (!node){
			node = fui.document.body;
		}
		
		node = $(node);

		_doParse(node);
		return this;
	};
	module.exports.parse = parse;	
});
fui.extend(fui.require('core/parse'));




