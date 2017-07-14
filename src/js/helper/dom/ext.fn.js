(function(fui){
	
	var win = fui.window,
	doc = fui.document,
	util = fui.util,
	$ = fui.dom;
	var fn = {
		each:function(callback){
			return util(this).each(callback);
		},
		find: function(selector) {
			var nodes = [];
			this.each(function() {
				var context = this.nodeType == 1 ? this :this[0];
				var childrens = $(selector, context);
				childrens.each(function() {
					nodes.push(this);
				});
			});
			var $nodes = $(nodes);
			$nodes.selector = this.selector + ' ' + selector;
			return $nodes;
		},
		filter:function(selector){
			var nodes = [];
			this.each(function(i){
				if (!selector.call(this,i)) nodes.push(this);
			})
			return $(nodes)
		},
		children:function(selector){
			return this.find('>'+selector||'*')
		},
		on:function(){
			
		},
		off:function(){
			
		},
		bind:function(){
			
		},
		unbind:function(){
			
		},
		one:function(){
			
		},
		eq: function(i) {
			return $(this[i]);
		},
		first: function() {
			return this.eq(0);
		},
		last: function() {
			return this.eq(this.length - 1);
		},
		attr: function(name, value) {	
			if(value){
				return this.each(function() {
					$.attr(this, name, value);
				})
			}
			return $.attr(this[0], name, value);
		},
		removeAttr: function(name) {
			var attrNames = util(name).to('array',' ');
			var node = this;
			util(attrNames).each(function(i,name){
				node.each(function() {
					this.removeAttribute(name)
				})
			})
			return this;
		},
		html: function(html) {
			if(html){
				return this.empty().append(html);
			}
			return this[0].innerHTML
		},
		text:function(text) {
			if(text){
				return this.empty().append(text);
			}
			return $.getText(this);
        },
		val: function(val) {
			if(val){
				return this.each(function() {
					this.value = val
				})
			}
			return this[0].value
		},
		css:function(prop, value) {
            if (value == undefined) {
                if ("object" === typeof prop) {
                    this.each(function(i, ele) {
                        for (var k in prop) ele.style[k] = prop[k];
                    });
                } else {
					if(this.length > 0){
						if(window.getComputedStyle){
							return window.getComputedStyle(this[0])[prop]
						}else{
							return this[0].currentStyle[prop]
						}
					}else{
						return undefined;
					}
                }
            } else {
                this.each(function() {
                    this.style[prop] = value;
                });
            }
            return this;
        },
		hide: function() {
			return this.css('display','none')
		},
		show: function() {
			return this.each(function(i, node) {
				if(this.style.display==='none'){
					this.style.display = 'block';
				}
			});
		},
		hasClass: function(className){
			return new RegExp("(\\s|^)" + className + "(\\s|$)")
					.test(this[0].className);
		},
		addClass: function(className){
			return this.each(function(i,ele){
				if (!$(this).hasClass(className))
					ele.className = [ ele.className, className]
					.join(' ').replace(/(^\s+)|(\s+$)/g, '');
			}) ; 
		},
		removeClass: function(className){
			return this.each(function(){
				if ($(this).hasClass(className)) 
					this.className =  this.className
					.replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), ' ')
					.replace(/(^\s+)|(\s+$)/g, '');
			});
		},
		// 节点尾部插入
		append:function(elem) {
			elem = $(elem);
			return this.each(function(i, node) {
				elem.each(function() {
					node.appendChild(this);
				})
			});
		},
		appendTo:function(elem){
			return $(elem).append(this);
		},
		// 节点头部插入
		prepend:function(elem) {
			var firstChild;
			elem = $(elem);
			return this.each(function(i, node) {
				firstChild = node.firstChild;
				elem.each(function() {
					node.insertBefore(this,firstChild);
				})
			});
		},
		prependTo:function(elem){
			return $(elem).prepend(this);
		},
		// 节点之前插入
		before:function(elem) {
			elem = $(elem);
			return this.each(function(i, node) {
				elem.each(function() {
					node.parentNode.insertBefore(this,node);
				});
			});
		},
		// 节点之后插入
		after:function(elem) {
			var sibling;
			elem = $(elem);
			return this.each(function(i, node) {
				sibling = node.nextSibling;
				elem.each(function() {
					node.parentNode.insertBefore(this,sibling);
				});
			});
		},
		remove:function(){
			return this.each(function() {
				this.parentNode.removeChild(this);
			});
		},
		empty:function() {
			return this.each(function() {
				this.innerHTML = '';
			});
		}
	};
	fui.extend($.fn,fn);
})(fui);
