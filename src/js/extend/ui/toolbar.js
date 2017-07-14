(function(fui){
	"use strict";
	fui.ToolBar = function() {
		fui.ToolBar.superclass.constructor.call(this);
	};

	fui.extend(fui.ToolBar, fui.Control, {
		_clearBorder: false,
		style: "paddind:10px",
		uiCls: "fui-toolbar",
		_create: function() {
			this.el = document.createElement("div");
			this.el.className = "fui-toolbar";
		},
		_initEvents: function() {},
		doLayout: function() {

			if (!this.canLayout()) return;
			var A = fui.getChildNodes(this.el, true);
			for (var $ = 0, _ = A.length; $ < _; $++) fui.layout(A[$]);
		},
		set_bodyParent: function($) {
			if (!$) return;
			this.el = $;
			this.doLayout();
		},
		getAttrs: function($) {
			var _ = {};
			this.el = $;
			this.el.uid = this.uid;
			return _;
		}
	});

	fui.regClass(fui.ToolBar, "toolbar");
})(fui);


jQuery(function() {
    fui.isReady = true;
    fui.parse();
    //fui._FireBindEvents();
});





