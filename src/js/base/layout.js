fui.define('core/layout',function( module ){

	'use strict';
	
	var $ = fui.jQuery;
	var util = fui.util;
	var layout = function(node) {
		if (!node){
			node = $(fui.document.body);
		}

		var obj = fui.get(node);
		if (obj) {
			if (obj.doLayout) if (!fui.components.layouts[obj.uid]) {
				fui.components.layouts[obj.uid] = obj;
				obj.doLayout(false);
				delete fui.components.layouts[obj.uid];
			}
		} else {
			obj = node.children();	
			obj.each(function(){
				fui.layout($(this));
			})
		};
		return this;
	};

	module.exports = {layout:layout};	
});
fui.extend(fui.require('core/layout'));




