
var Vs = function($) {
		if (typeof $ == "string") {
			if ($.charAt(0) == "#") $ = $.substr(1);
			return document.getElementById($);
		} else return $;
	};
	
	var $s = function($, _) {
		$ = Vs($);
		if (!$) return;
		var A = $.className.split(" ");
		return A.indexOf(_) != -1;
	};
	
Ik = function($, _) {
    if (!_) return;
    if ($s($, _) == false) jQuery($).addClass(_);
};

JB = function($, _) {
    if (!_) return;
    jQuery($).removeClass(_);
};

Yo = function($) {
    $ = Vs($);
    var _ = jQuery($);
    return {
        top: parseInt(_.css("margin-top"), 10) || 0,
        left: parseInt(_.css("margin-left"), 10) || 0,
        bottom: parseInt(_.css("margin-bottom"), 10) || 0,
        right: parseInt(_.css("margin-right"), 10) || 0
    };
};

Ni = function($) {
    $ = Vs($);
    var _ = jQuery($);
    return {
        top: parseInt(_.css("border-top-width"), 10) || 0,
        left: parseInt(_.css("border-left-width"), 10) || 0,
        bottom: parseInt(_.css("border-bottom-width"), 10) || 0,
        right: parseInt(_.css("border-right-width"), 10) || 0
    };
};

Lu = function($) {
    $ = Vs($);
    var _ = jQuery($);
    return {
        top: parseInt(_.css("padding-top"), 10) || 0,
        left: parseInt(_.css("padding-left"), 10) || 0,
        bottom: parseInt(_.css("padding-bottom"), 10) || 0,
        right: parseInt(_.css("padding-right"), 10) || 0
    };
};

Sq = function(A, _) {
    A = Vs(A);
    _ = parseInt(_);
    if (isNaN(_) || !A) return;
    if (jQuery.boxModel) {
        var B = Lu(A), C = Ni(A);
        _ = _ - B.left - B.right - C.left - C.right;
    }
    var $ = Yo(A);
    _ = _ - $.left - $.right;
    if (_ < 0) _ = 0;
    A.style.width = _ + "px";
};

QL = function(A, _) {
    A = Vs(A);
    _ = parseInt(_);
    if (isNaN(_) || !A) return;
    if (jQuery.boxModel) {
        var B = Lu(A), C = Ni(A);
        _ = _ - B.top - B.bottom - C.top - C.bottom;
    }
    var $ = Yo(A);
    _ = _ - $.top - $.bottom;
    if (_ < 0) _ = 0;
    A.style.height = _ + "px";
};

K1 = function($, _) {
    $ = Vs($);
    if ($.style.display == "none") return 0;
    return _ ? jQuery($).width() : jQuery($).outerWidth();
};

RK = function($, _) {
    $ = Vs($);
    if ($.style.display == "none") return 0;
    return _ ? jQuery($).height() : jQuery($).outerHeight();
};

KM = function(A, C, B, $, _) {
    if (B === undefined) {
        B = C.y;
        $ = C.width;
        _ = C.height;
        C = C.x;
    }
    mini.setXY(A, C, B);
    Sq(A, $);
    QL(A, _);
};

Rk = function(A) {
    var $ = mini.getXY(A), _ = {
        x: $[0],
        y: $[1],
        width: K1(A),
        height: RK(A)
    };
    _.left = _.x;
    _.top = _.y;
    _.right = _.x + _.width;
    _.bottom = _.y + _.height;
    return _;
};

Bn = function(A, B) {
    A = Vs(A);
    if (!A || typeof B != "string") return;
    var F = jQuery(A), _ = B.toLowerCase().split(";");
    for (var $ = 0, C = _.length; $ < C; $++) {
        var E = _[$], D = E.split(":");
        if (D.length == 2) F.css(D[0].trim(), D[1].trim());
    }
};

Id = function() {
    var $ = document.defaultView;
    return new Function("el", "style", [ "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));", "style=='float' && (style='", $ ? "cssFloat" : "styleFloat", "');return el.style[style] || ", $ ? "window.getComputedStyle(el,null)[style]" : "el.currentStyle[style]", " || null;" ].join(""));
}();

Ml = function(A, $) {
    var _ = false;
    A = Vs(A);
    $ = Vs($);
    if (A === $) return true;
    if (A && $) if (A.contains) {
        try {
            return A.contains($);
        } catch (B) {
            return false;
        }
    } else if (A.compareDocumentPosition) return !!(A.compareDocumentPosition($) & 16); else while ($ = $.parentNode) _ = $ == A || _;
    return _;
};

$Q = function(B, A, $) {
    B = Vs(B);
    var C = document.body, _ = 0, D;
    $ = $ || 50;
    if (typeof $ != "number") {
        D = Vs($);
        $ = 10;
    }
    while (B && B.nodeType == 1 && _ < $ && B != C && B != D) {
        if ($s(B, A)) return B;
        _++;
        B = B.parentNode;
    }
    return null;
};
fui.applyTo = function(_) {
    _ = Vs(_);
    if (!_) return this;
    if (fui.get(_)) throw new Error("not applyTo a fui control");
    var $ = this.getAttrs(_);
    delete $._applyTo;
    if ($.defaultValue == null && $.value !=null ) $.defaultValue = $.value;
    var A = _.parentNode;
    if (A && this.el != _) A.replaceChild(this.el, _);
    this.set($);
    this.E2P(_);
    return this;
};

fui.copyTo(fui, {
    byId: Vs,
    hasClass: $s,
    addClass: Ik,
    removeClass: JB,
    getMargins: Yo,
    getBorders: Ni,
    getPaddings: Lu,
    setWidth: Sq,
    setHeight: QL,
    getWidth: K1,
    getHeight: RK,
    setBox: KM,
    getBox: Rk,
    setStyle: Bn,
    getStyle: Id,
    repaint: function($) {
        if (!$) $ = document.body;
        Ik($, "fui-repaint");
        setTimeout(function() {
            JB($, "fui-repaint");
        }, 1);
    },
    getSize: function($, _) {
        return {
            width: K1($, _),
            height: RK($, _)
        };
    },
    setSize: function(A, $, _) {
        Sq(A, $);
        QL(A, _);
    },
    setX: function(_, B) {
        var $ = jQuery(_).offset(), A = $.top;
        if (A === undefined) A = $[1];
        fui.setXY(_, B, A);
    },
    setY: function(_, A) {
        var $ = jQuery(_).offset(), B = $.left;
        if (B === undefined) B = $[0];
        fui.setXY(_, B, A);
    },
    setXY: function(_, B, A) {
        var $ = {
            left: B,
            top: A
        };
        jQuery(_).offset($);
        jQuery(_).offset($);
    },
    getXY: function(_) {
        var $ = jQuery(_).offset();
        return [ $.left, $.top ];
    },
    getViewportBox: function() {
        var $ = jQuery(window).width(), _ = jQuery(window).height(), B = jQuery(document).scrollLeft(), A = jQuery(document.body).scrollTop();
        if (document.documentElement) A = document.documentElement.scrollTop;
        return {
            x: B,
            y: A,
            width: $,
            height: _,
            right: B + $,
            bottom: A + _
        };
    },
    getChildNodes: function(A, C) {
        A = Vs(A);
        if (!A) return;
        var E = A.childNodes, B = [];
        for (var $ = 0, D = E.length; $ < D; $++) {
            var _ = E[$];
            if (_.nodeType == 1 || C === true) B.push(_);
        }
        return B;
    },
    removeChilds: function(B, _) {
        B = Vs(B);
        if (!B) return;
        var C = fui.getChildNodes(B, true);
        for (var $ = 0, D = C.length; $ < D; $++) {
            var A = C[$];
            if (_ && A == _) ; else B.removeChild(C[$]);
        }
    },
    isAncestor: Ml,
    findParent: $Q,
    findChild: function(_, A) {
        _ = Vs(_);
        var B = _.getElementsByTagName("*");
        for (var $ = 0, C = B.length; $ < C; $++) {
            var _ = B[$];
            if ($s(_, A)) return _;
        }
    },
    isAncestor: function(A, $) {
        var _ = false;
        A = Vs(A);
        $ = Vs($);
        if (A === $) return true;
        if (A && $) if (A.contains) {
            try {
                return A.contains($);
            } catch (B) {
                return false;
            }
        } else if (A.compareDocumentPosition) return !!(A.compareDocumentPosition($) & 16); else while ($ = $.parentNode) _ = $ == A || _;
        return _;
    },
    getOffsetsTo: function(_, A) {
        var $ = this.getXY(_), B = this.getXY(A);
        return [ $[0] - B[0], $[1] - B[1] ];
    },
    scrollIntoView: function(I, H, F) {
        var B = Vs(H) || document.body, $ = this.getOffsetsTo(I, B), C = $[0] + B.scrollLeft, J = $[1] + B.scrollTop, D = J + I.offsetHeight, A = C + I.offsetWidth, G = B.clientHeight, K = parseInt(B.scrollTop, 10), _ = parseInt(B.scrollLeft, 10), L = K + G, E = _ + B.clientWidth;
        if (I.offsetHeight > G || J < K) B.scrollTop = J; else if (D > L) B.scrollTop = D - G;
        B.scrollTop = B.scrollTop;
        if (F !== false) {
            if (I.offsetWidth > B.clientWidth || C < _) B.scrollLeft = C; else if (A > E) B.scrollLeft = A - B.clientWidth;
            B.scrollLeft = B.scrollLeft;
        }
        return this;
    },
    setOpacity: function(_, $) {
        jQuery(_).css({
            opacity: $
        });
    },
    selectable: function(_, $) {
        _ = Vs(_);
        if (!!$) {
            jQuery(_).removeClass("fui-unselectable");
            if (fui.isIE) _.unselectable = "off"; else {
                _.style.MozUserSelect = "";
                _.style.KhtmlUserSelect = "";
                _.style.UserSelect = "";
            }
        } else {
            jQuery(_).addClass("fui-unselectable");
            if (fui.isIE) _.unselectable = "on"; else {
                _.style.MozUserSelect = "none";
                _.style.UserSelect = "none";
                _.style.KhtmlUserSelect = "none";
            }
        }
    },
    selectRange: function(B, A, _) {
        if (B.createTextRange) {
            var $ = B.createTextRange();
            $.moveStart("character", A);
            $.moveEnd("character", _ - B.value.length);
            $.select();
        } else if (B.setSelectionRange) B.setSelectionRange(A, _);
        try {
            B.focus();
        } catch (C) {}
    },
    getSelectRange: function(A) {
        A = Vs(A);
        if (!A) return;
        try {
            A.focus();
        } catch (C) {}
        var $ = 0, B = 0;
        if (A.createTextRange) {
            var _ = document.selection.createRange().duplicate();
            _.moveEnd("character", A.value.length);
            if (_.text === "") $ = A.value.length; else $ = A.value.lastIndexOf(_.text);
            _ = document.selection.createRange().duplicate();
            _.moveStart("character", -A.value.length);
            B = _.text.length;
        } else {
            $ = A.selectionStart;
            B = A.selectionEnd;
        }
        return [ $, B ];
    }
});





(function(fui){

	"use strict";
	
	fui.Component = function() {
		this.Lg = {};
		this.uid = fui.creatId();
		if (!this.id) {
			this.id = this.uid;
		};
		fui.reg(this);
	};

	fui.Component.prototype = {
		isControl: true,
		id: null,
		Nw: false,
		T7: true,
		set: function(B) {
			if (typeof B == "string") return this;
			var A = this.allowLayout;
			this.allowLayout = false;
			var C = B.renderTo || B.render;
			delete B.renderTo;
			delete B.render;
			for (var $ in B) if ($.toLowerCase().indexOf("on") == 0) {
				var F = B[$];
				this.on($.substring(2, $.length).toLowerCase(), F);
				delete B[$];
			}
			for ($ in B) {
				var E = B[$], D = "set" + $.charAt(0).toUpperCase() + $.substring(1, $.length), _ = this[D];
				if (_) _.call(this, E); else this[$] = E;
			}
			if (C && this.render) this.render(C);
			this.allowLayout = A;
			if (this.doLayout) this.doLayout();
			return this;
		},
		fire: function(A, B) {
			if (this.T7 == false) return;
			A = A.toLowerCase();
			var _ = this.Lg[A];
			if (_) {
				if (!B) B = {};
				if (B && B != this) {
					B.source = B.sender = this;
					if (!B.type) B.type = A;
				}
				for (var $ = 0, D = _.length; $ < D; $++) {
					var C = _[$];
					if (C) C[0].apply(C[1], [ B ]);
				}
			}
		},
		on: function(type, fn, scope) {
			if (typeof fn == "string") {
				var f = fui._getFunctoin(fn);
				if (!f) {
					var id = fui.creatId("__str_");
					window[id] = fn;
					eval("fn = function(e){var s = " + id + ";var fn = fui._getFunctoin(s); if(fn) {fn.call(this,e)}else{eval(s);}}");
				} else fn = f;
			}
			if (typeof fn != "function" || !type) return false;
			type = type.toLowerCase();
			var event = this.Lg[type];
			if (!event) event = this.Lg[type] = [];
			scope = scope || this;
			if (!this.findListener(type, fn, scope)) event.push([ fn, scope ]);
			return this;
		},
		un: function($, C, _) {
			if (typeof C != "function") return false;
			$ = $.toLowerCase();
			var A = this.Lg[$];
			if (A) {
				_ = _ || this;
				var B = this.findListener($, C, _);
				if (B) A.remove(B);
			}
			return this;
		},
		findListener: function(A, E, B) {
			A = A.toLowerCase();
			B = B || this;
			var _ = this.Lg[A];
			if (_) for (var $ = 0, D = _.length; $ < D; $++) {
				var C = _[$];
				if (C[0] === E && C[1] === B) return C;
			}
		},
		setId: function($) {
			if (!$) throw new Error("id not null");
			if (this.Nw) throw new Error("id just set only one");
			fui["unreg"](this);
			this.id = $;
			if (this.el) this.el.id = $;
			if (this.Aw) this.Aw.id = $ + "$text";
			if (this.Ts) this.Ts.id = $ + "$value";
			this.Nw = true;
			fui.reg(this);
		},
		getId: function() {
			return this.id;
		},
		destroy: function() {
			fui["unreg"](this);
			this.fire("destroy");
		}
	};
	
	
	
	var getChildNodes =  function(A, C) {
        A = Vs(A);
        if (!A) return;
        var E = A.childNodes, B = [];
        for (var $ = 0, D = E.length; $ < D; $++) {
            var _ = E[$];
            if (_.nodeType == 1 || C === true) B.push(_);
        }
        return B;
    }
	fui.parse = function($) {
		if (typeof $ == "string") {
			var _ = $;
			$ = Vs(_);
			if (!$) $ = document.body;
		}
		if ($ && !fui.isElement($)) $ = $.el;
		if (!$) $ = document.body;
		fui._doParse($);
		fui.layout();
	};
	
	fui._Layouts = {};

	fui.layout = function($) {
		
		
		function _(B) {
			
			var C = fui.get(B);
			
			if (C) {
				if (C.doLayout) if (!fui._Layouts[C.uid]) {
					fui._Layouts[C.uid] = C;
					C.doLayout(fui.classes);
					delete fui._Layouts[C.uid];
				}
			} else {
				var D = B.childNodes;
				if (D) for (var $ = 0, E = D.length; $ < E; $++) {
					var A = D[$];
					_(A);
				}
			}
		}
		if (!$) $ = document.body;
		_($);
	};
	
	fui._doParse = function(G) {
		var F = G.nodeName.toLowerCase();
		if (!F) return;
		var B = G.className;
		if (B) {
			var $ = fui.get(G);
			if (!$) {
				var H = B.split(" ");
				for (var E = 0, C = H.length; E < C; E++) {
					var A = H[E], I = fui.getClassByUICls(A);
					if (I) {
						var D = new I();
						fui.applyTo.call(D, G);
						
						G = D.el;
						
						break;
					}
				}
			}
		}
		if (F == "select" || $s(G, "fui-menu") || $s(G, "fui-datagrid") || $s(G, "fui-treegrid") || $s(G, "fui-tree") || $s(G, "fui-button") || $s(G, "fui-textbox") || $s(G, "fui-buttonedit")) return;
		var J = getChildNodes(G, true);
		
		for (E = 0, C = J.length; E < C; E++) {
			var _ = J[E];
			if (_.nodeType == 1) if (_.parentNode == G) {
				fui._doParse(_);
			}
		}
	};

	
})(fui);





