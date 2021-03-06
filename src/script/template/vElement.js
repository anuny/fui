fui.define('template/vElement',function( module ){
	var util = fui.require('template/util');
	//虚拟dom
	var vElement = function(tagName, props, children) {
		//保证只能通过如下方式调用：new vElement
		if (!(this instanceof vElement)) {
			return new vElement(tagName, props, children);
		}

		//可以通过只传递tagName和children参数
		if (fui.util(props).isArray) {
			children = props;
			props = {};
		}

		//设置虚拟dom的相关属性
		this.tagName = tagName;
		this.props = props || {};
		this.children = children || [];
		this.key = props ? props.key : void 666;
		var count = 0;
		util.each(this.children, function(child, i) {
			if (child instanceof vElement) {
				count += child.count;
			} else {
				children[i] = '' + child;
			}
			count++;
		});
		this.count = count;
	}

	//根据虚拟dom创建真实dom
	vElement.prototype.render = function() {
		
		 
		//创建标签
		var el = document.createElement(this.tagName);
		//设置标签的属性
		var props = this.props;
		
		for (var propName in props) {
			var propValue = props[propName]
			util.setAttr(el, propName, propValue);
		}

		//一次创建子节点的标签
		util.each(this.children, function(child) {
			//如果子节点仍然为velement，则递归的创建子节点，否则直接创建文本类型节点
			var childEl = (child instanceof vElement) ? child.render() : document.createTextNode(child);
			el.appendChild(childEl);
		});

		return el;
	};
	
	

	module.exports = vElement;
});
