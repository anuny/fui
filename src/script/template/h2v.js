fui.define('template/h2v',function( module ){
	var vElement = fui.require('template/vElement');
	
	function h2v (html) {
		
	  var root = $(html)[0];
	  return {
		vdom: toVirtualDOM(root),
		dom: root
	  }
	}

	function toVirtualDOM (dom) {
	  var tagName = dom.tagName && dom.tagName.toLowerCase();
	  var props = attrsToObj(dom)
	  var children = []
	  for (var i = 0, len = dom.childNodes.length; i < len; i++) {
		var node = dom.childNodes[i]
		// TEXT node
		if (node.nodeType === 3) {
		  if (node.nodeValue) {
			children.push(node.nodeValue)
		  } else {
			children.push(node.textContent)
		  }
		} else {
		  children.push(toVirtualDOM(node))
		}
	  }
	  return vElement(tagName, props, children)
	}

	function attrsToObj (dom) {
		if(!dom.nodeType){
			return
		}
		
	  var attrs = dom.attributes;
	  if(!attrs){
		  return
	  }
	  var props = {}
	  for (var i = 0, len = attrs.length; i < len; i++) {
		var name = attrs[i].name
		var value = attrs[i].value
		if (value && value !== 'null') {
		  props[name] = value
		}
	  }
	  if (dom.style.cssText) {
		props.style = dom.style.cssText
	  }
	  return props
	}

	module.exports = h2v;
});
