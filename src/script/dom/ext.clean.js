!function(fui, util, $) {
    $.extend({
        clean:function(elems, context) {
            var wrapMap = {
                option   : [ 1, "<select multiple='multiple'>", "</select>" ],
                legend   : [ 1, "<fieldset>", "</fieldset>" ],
                thead    : [ 1, "<table>", "</table>" ],
                tr       : [ 2, "<table><tbody>", "</tbody></table>" ],
                td       : [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                col      : [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
                area     : [ 1, "<map>", "</map>" ],
                optgroup : [ 1, "<select multiple='multiple'>", "</select>" ],
                caption  : [ 1, "<table>", "</table>" ],
                colgroup : [ 1, "<table>", "</table>" ],
                tfoot    : [ 1, "<table>", "</table>" ],
                tbody    : [ 1, "<table>", "</table>" ],
                th       : [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                _default : $.support.htmlSerialize ? [ 0, "", "" ] :[ 1, "X<div>", "</div>" ]
            },
			nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
						"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
			
            safeFragment = createSafeFragment(document);
			
            function createSafeFragment(context) {
                var list = nodeNames.split("|"), safeFrag = context.createDocumentFragment();
                if (safeFrag.createElement) {
                    while (list.length) {
                        safeFrag.createElement(list.pop());
                    }
                }
                return safeFrag;
            }
	
			function fixDefaultChecked( elem ) {
				if ( /^(?:checkbox|radio)$/i.test( elem.type ) ) {
					elem.defaultChecked = elem.checked;
				}
			}

            var i, j, elem, tag, wrap, depth, div, hasBody, tbody, 
				safe = context === document && safeFragment, ret = [];
			
            // 确保变量context为文档根节点document
            if (!context || typeof context.createDocumentFragment === "undefined") {
                context = document;
            }
			
            // Use the already-created safe fragment if context permits
            for (i = 0; (elem = elems[i]) != null; i++) {
                // 如果elem为数字,则将其转换为字符串
                if (typeof elem === "number") {
                    elem += "";
                }
                // 如果elem为undefined,跳出本次循环
                if (!elem) {
                    continue;
                }

                // 转换数组项(字符串)为DOM节点
                if (typeof elem === "string") {
					
                    // 如果不存在html实体编号或标签,则创建文本节点
                    if (!/<|&#?\w+;/.test(elem)) {
                        elem = context.createTextNode(elem);
                    } else {
						
                        // safe为#document-fragment类型,在ie9以下浏览器中,safe为HTMLDocument类型节点,且nodeNames数组为空
                        safe = safe || createSafeFragment(context);
						
                        // 创建一个div元素并将其插入到文档碎片中
                        div = context.createElement("div");
						
                        safe.appendChild(div);
						
                        // 除了area,br,col,embed,hr,img,input,link,meta,param这些标签外,
                        // 将开始标签末尾加入斜杠的标签转换为开始和结束标签
                        elem = elem.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>");
						
                        // 获取左边第一个标签元素
                        tag = (/<([\w:]+)/.exec(elem) || [ "", "" ])[1].toLowerCase();
						
                        // 获取最外层元素的包裹元素,并将元素包裹在其中
                        wrap = wrapMap[tag] || wrapMap._default;
                        depth = wrap[0];
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        // 如果元素的包裹深度大于1,div重新赋值为元素最近的包裹元素(即:包含第一层包裹元素)
                        while (depth--) {
                            div = div.lastChild;
                        }
                        
                        // 在IE6,7中,清除字符串中空table标签中自动加入的tbody标签(手动加入的除外)
                        if (!$.support.tbody) {
                            
                            // 判断字符串中是否拥有空tbody标签
                            hasBody = /<tbody/i.test(elem);
							
                            // 如果最外层标签为table且table中没有手动加入tbody
                            // 变量tbody为div.firstChild.childNodes(自动加入的tbody标签集合)
                            tbody = tag === "table" && !hasBody ? div.firstChild && div.firstChild.childNodes :
							
                            // 如果字符串中仅有一个空thead或tfoot标签
                            // 变量tbody为div.childNodes(字符串中的thead和tfoot标签集合)
                            wrap[1] === "<table>" && !hasBody ? div.childNodes :[];
							
                            for (j = tbody.length - 1; j >= 0; --j) {
								
                                // 排除thead或tfoot标签
                                if ($.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
									
                                    // 清除空table标签中自动加入的tbody
                                    tbody[j].parentNode.removeChild(tbody[j]);
                                }
                            }
                        }
                       
                        // 在ie9以下浏览器中,字符串以空白字符串开头,将空白字符串作为div元素的第一个文本子节点
                        if (!$.support.leadingWhitespace && /^\s+/.test(elem)) {
                            div.insertBefore(context.createTextNode(/^\s+/.exec(elem)[0]), div.firstChild);
                        }
						
                        // 获取已经处理完毕的div子节点集合(nodeList对象)
                        elem = div.childNodes;

                        // 在下一次循环处理字符串数组项前,清除处理创建过的div元素
                        div.parentNode.removeChild(div);
                    }
                }
				
                // 如果elem为DOM节点(文本节点)
                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    $.merge(ret, elem);
                }
            }
            
            if (div) {
                elem = div = safe = null;
            }
			
            // 在ie6,7中,拥有checked属性的单选按钮,复选框在插入到其他标签后,选中状态会失效(下面代码修复该bug)
            if (!$.support.appendChecked) {
                for (i = 0; (elem = ret[i]) != null; i++) {
                    if ($.nodeName(elem, "input")) {
                        fixDefaultChecked(elem);
                    } else if (typeof elem.getElementsByTagName !== "undefined") {
                        $.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
                    }
                }
            }
            return ret;
        }
    });
}(fui, fui.util, fui.dom);