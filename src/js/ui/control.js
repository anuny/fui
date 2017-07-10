(function(fui){
	"use strict";
	fui.Control = function() {
		fui.Control.superclass.constructor.call(this);
		this._create();
		this.el.uid = this.uid;
		this._initEvents();
		if (this.D0) this.el.style.borderWidth = "0";
		this.addCls(this.uiCls);
		this.setWidth(this.width);
		this.setHeight(this.height);
		this.el.style.display = this.visible ? this.displayStyle : "none";
	};

	fui.extend(fui.Control, fui.Component, {
		PE: null,
		width: "",
		height: "",
		visible: true,
		readOnly: false,
		R1: true,
		EV: "fui-readonly",
		M5: "fui-disabled",
		_create: function() {
			this.el = document.createElement("div");
		},
		_initEvents: function() {},
		within: function($) {
			if (Ml(this.el, $.target)) return true;
			return false;
		},
		name: "",
		setName: function($) {
			this.name = $;
		},
		getName: function() {
			return this.name;
		},
		isAutoHeight: function() {
			var $ = this.el.style.height;
			return $ == "auto" || $ == "";
		},
		isAutoWidth: function() {
			var $ = this.el.style.width;
			return $ == "auto" || $ == "";
		},
		isRender: function($) {
			return !!(this.el && this.el.parentNode && this.el.parentNode.tagName);
		},
		render: function(_, $) {
			if (typeof _ === "string") if (_ == "#body") _ = document.body; else _ = Vs(_);
			if (!_) return;
			if (!$) $ = "append";
			$ = $.toLowerCase();
			if ($ == "before") jQuery(_).before(this.el); else if ($ == "preend") jQuery(_).preend(this.el); else if ($ == "after") jQuery(_).after(this.el); else _.appendChild(this.el);
			this.el.id = this.id;
			this.doLayout();
			this.fire("render");
		},
		getEl: function() {
			return this.el;
		},
		setJsName: function($) {
			this.PE = $;
			window[$] = this;
		},
		getJsName: function() {
			return this.PE;
		},
		setWidth: function($) {
			if (parseInt($) == $) $ += "px";
			this.width = $;
			this.el.style.width = $;
			this.doLayout();
		},
		getWidth: function(_) {
			var $ = _ ? jQuery(this.el).width() : jQuery(this.el).outerWidth();
			if (_ && this.C9) {
				var A = Ni(this.C9);
				$ = $ - A.left - A.right;
			}
			return $;
		},
		setHeight: function($) {
			if (parseInt($) == $) $ += "px";
			this.height = $;
			this.el.style.height = $;
			this.doLayout();
		},
		getHeight: function(_) {
			var $ = _ ? jQuery(this.el).height() : jQuery(this.el).outerHeight();
			if (_ && this.C9) {
				var A = Ni(this.C9);
				$ = $ - A.top - A.bottom;
			}
			return $;
		},
		getBox: function() {
			return Rk(this.el);
		},
		setBorderStyle: function($) {
			var _ = this.C9 || this.el;
			Bn(_, $);
			this.doLayout();
		},
		getBorderStyle: function() {
			return this.Qp;
		},
		D0: true,
		setStyle: function($) {
			this.style = $;
			Bn(this.el, $);
			if (this.D0) this.el.style.borderWidth = "0";
			this.doLayout();
		},
		getStyle: function() {
			return this.style;
		},
		setCls: function($) {
			JB(this.el, this.cls);
			Ik(this.el, $);
			this.cls = $;
		},
		getCls: function() {
			return this.cls;
		},
		addCls: function($) {
			Ik(this.el, $);
		},
		removeCls: function($) {
			JB(this.el, $);
		},
		setReadOnly: function($) {
			this.readOnly = $;
			if ($) this.addCls(this.EV); else this.removeCls(this.EV);
		},
		getReadOnly: function() {
			return this.readOnly;
		},
		getParent: function(A) {
			var $ = document, B = this.el.parentNode;
			while (B != $ && B != null) {
				var _ = fui.get(B);
				if (_) {
					if (!fui.isControl(_)) return null;
					if (!A || _.uiCls == A) return _;
				}
				B = B.parentNode;
			}
			return null;
		},
		isReadOnly: function() {
			if (this.readOnly || !this.R1) return true;
			var $ = this.getParent();
			if ($) return $.isReadOnly();
			return false;
		},
		setEnabled: function($) {
			this.R1 = $;
			if ($) this.removeCls(this.M5); else this.addCls(this.M5);
		},
		getEnabled: function() {
			return this.R1;
		},
		enable: function() {
			this.setEnabled(true);
		},
		disable: function() {
			this.setEnabled(false);
		},
		displayStyle: "",
		setVisible: function($) {
			this.visible = $;
			if (this.el) {
				this.el.style.display = $ ? this.displayStyle : "none";
				this.doLayout();
			}
		},
		getVisible: function() {
			return this.visible;
		},
		show: function() {
			this.setVisible(true);
		},
		hide: function() {
			this.setVisible(false);
		},
		isDisplay: function() {
			if (fui.WindowVisible == false) return false;
			var $ = document.body, _ = this.el;
			while (1) {
				if (_ == null || !_.style) return false;
				if (_ && _.style && _.style.display == "none") return false;
				if (_ == $) return true;
				_ = _.parentNode;
			}
			return true;
		},
		allowUpdate: true,
		beginUpdate: function() {
			this.allowUpdate = false;
		},
		endUpdate: function() {
			this.allowUpdate = true;
			this.doUpdate();
		},
		doUpdate: function() {},
		canLayout: function() {
			if (this.allowLayout == false) return false;
			return this.isDisplay();
		},
		doLayout: function() {},
		layoutChanged: function() {
			if (this.canLayout() == false) return;
			this.doLayout();
		},
		destroy: function(_) {
			if (this.el) ;
			if (this.el) {
				fui.clearEvent(this.el);
				if (_ !== false) {
					var $ = this.el.parentNode;
					if ($) $.removeChild(this.el);
				}
			}
			this.C9 = null;
			this.el = null;
			fui["unreg"](this);
			this.fire("destroy");
		},
		focus: function() {
			try {
				var $ = this;
				$.el.focus();
			} catch (_) {}
		},
		blur: function() {
			try {
				var $ = this;
				$.el.blur();
			} catch (_) {}
		},
		allowAnim: true,
		setAllowAnim: function($) {
			this.allowAnim = $;
		},
		getAllowAnim: function() {
			return this.allowAnim;
		},
		BaX: function() {
			return this.el;
		},
		mask: function($) {
			if (typeof $ == "string") $ = {
				html: $
			};
			$ = $ || {};
			$.el = this.BaX();
			if (!$.cls) $.cls = this.maskCls;
			fui.mask($);
		},
		unmask: function() {
			fui.unmask(this.BaX());
		},
		maskCls: "fui-mask-loading",
		loadingMsg: "Loading...",
		loading: function() {
			this.mask(this.loadingMsg);
		},
		Ag: null,
		setContextMenu: function($) {
			var _ = $;
			if (typeof $ == "string") {
				_ = fui.get($);
				if (!_) {
					fui.parse($);
					_ = fui.get($);
				}
			} else if (fui.isArray($)) _ = {
				type: "menu",
				items: $
			}; else if (!fui.isControl($)) _ = fui.create($);
			if (this.Ag !== _) {
				this.Ag = _;
				this.Ag.owner = this;
				_p(this.el, "contextmenu", function(_) {
					var $ = {
						popupEl: this.el,
						htmlEvent: _,
						cancel: false
					};
					this.Ag.fire("BeforeOpen", $);
					if ($.cancel == true) return;
					this.Ag.fire("opening", $);
					if ($.cancel == true) return;
					this.Ag.showAtPos(_.pageX, _.pageY);
					this.Ag.fire("Open", $);
					return false;
				}, this);
			}
		},
		getContextMenu: function() {
			return this.Ag;
		},
		setDefaultValue: function($) {
			this.defaultValue = $;
		},
		getDefaultValue: function() {
			return this.defaultValue;
		},
		setValue: function($) {
			this.value = $;
		},
		getValue: function() {
			return this.value;
		},
		E2P: function($) {},
		getAttrs: function(C) {
			var I = {}, F = C.className;
			if (F) I.cls = F;
			fui._ParseString(C, I, [ "id", "name", "width", "height", "borderStyle", "value", "defaultValue", "contextMenu" ]);
			fui._ParseBool(C, I, [ "visible", "enabled", "readOnly" ]);
			if (C.readOnly) I.readOnly = true;
			var E = C.style.cssText;
			if (E) I.style = E;
			if (fui.isIE9) {
				var _ = C.style.background;
				if (_) {
					if (!I.style) I.style = "";
					I.style += ";background:" + _;
				}
			}
			if (this.style) if (I.style) I.style = this.style + ";" + I.style; else I.style = this.style;
			if (this.Qp) if (I.borderStyle) I.borderStyle = this.Qp + ";" + I.borderStyle; else I.borderStyle = this.Qp;
			var B = fui._attrs;
			if (B) for (var $ = 0, G = B.length; $ < G; $++) {
				var D = B[$], H = D[0], A = D[1];
				if (!A) A = "string";
				if (A == "string") fui._ParseString(C, I, [ H ]); else if (A == "bool") fui._ParseBool(C, I, [ H ]); else if (A == "int") fui._ParseInt(C, I, [ H ]);
			}
			return I;
		}
	});
})(fui);





