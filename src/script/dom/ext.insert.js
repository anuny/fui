!function(fui,util,$){
	var doc = document;
	$.extend({
		insert: function(element,position,html) {
			if( doc.createElement( "div" ).insertAdjacentHTML ){
				if(html.nodeType){
					html = toHtml(html);
				};
				return element.insertAdjacentHTML( position, html );
			};
			
			function toDom (html){
				if(html.nodeType){
					return html;
				}
				var div= document.createElement("div");
				var frag = document.createDocumentFragment();
				div.innerHTML = html;
				while( div.firstChild ){
					frag.appendChild( div.firstChild );
				}
				div = null;
				return frag;
			}

			function toHtml (html){
				if(!html.nodeType){
					return html;
				}
				if('outerHTML' in html){
					return html.outerHTML;
				} else {
					var div= document.createElement("div");
					div.appendChild(html);
					html = div.innerHTML;
					div = null;
					return html
				}
			}

			var insert = {
				beforebegin : function(element, html ){
					element.parentNode.insertBefore( html, element );
				},
				afterend : function(element, html ){
					element.parentNode.insertBefore( html, element.nextSibling );
				},
				afterbegin : function(element, html ){
					element.insertBefore( html, element.firstChild );
				},
				beforeend : function(element, html ){
					element.appendChild( html );
				}
			};
			if(!html.nodeType){
				html = toDom( html );
			}
			return insert[position](element,html);
		}
	});
}(fui,fui.util,fui.dom);


