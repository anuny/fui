!function(fui,util,$){
	var exports = (function() {
		var support, all, a, select, opt, input, fragment, eventName, isSupported, i,div = document.createElement("div");

		div.setAttribute( "className", "t" );
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

		
		all = div.getElementsByTagName("*");
		a = div.getElementsByTagName("a")[ 0 ];
		if ( !all || !a || !all.length ) {
			return {};
		}

		select = document.createElement("select");
		opt = select.appendChild( document.createElement("option") );
		input = div.getElementsByTagName("input")[ 0 ];

		a.style.cssText = "top:1px;float:left;opacity:.5";
		support = {
			getSetAttribute: div.className !== "t",
			leadingWhitespace: div.firstChild.nodeType === 3,
			tbody: !div.getElementsByTagName("tbody").length,
			htmlSerialize: !!div.getElementsByTagName("link").length,
			style: /top/.test( a.getAttribute("style") ),
			hrefNormalized: a.getAttribute("href") === "/a",
			opacity: /^0.5/.test( a.style.opacity ),
			cssFloat: !!a.style.cssFloat,
			checkOn: !!input.value,
			optSelected: opt.selected,
			enctype: !!document.createElement("form").enctype,
			html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",
			boxModel: document.compatMode === "CSS1Compat",
			deleteExpando: true,
			noCloneEvent: true,
			inlineBlockNeedsLayout: false,
			shrinkWrapBlocks: false,
			reliableMarginRight: true,
			boxSizingReliable: true,
			pixelPosition: false
		};
		input.checked = true;
		support.noCloneChecked = input.cloneNode( true ).checked;
		select.disabled = true;
		support.optDisabled = !opt.disabled;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
		input = document.createElement("input");
		input.setAttribute( "value", "" );
		support.input = input.getAttribute( "value" ) === "";
		input.value = "t";
		input.setAttribute( "type", "radio" );
		support.radioValue = input.value === "t";
		input.setAttribute( "checked", "t" );
		input.setAttribute( "name", "t" );

		fragment = document.createDocumentFragment();
		fragment.appendChild( input );
		support.appendChecked = input.checked;
		support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
		if ( div.attachEvent ) {
			div.attachEvent( "onclick", function() {
				support.noCloneEvent = false;
			});

			div.cloneNode( true ).click();
		}
		for ( i in { submit: true, change: true, focusin: true }) {
			div.setAttribute( eventName = "on" + i, "t" );

			support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
		}

		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
		all = select = fragment = opt = a = input = null;
		return support;
	})();
	$.extend($.support,exports);
}(fui,fui.util,fui.dom);
