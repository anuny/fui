(function(){
	var $ = fui.jQuery;
	fui.plugin('layout','control',function(){
		this.className = 'fui-layout';
		return this;
	}).extend({
		_getTemplate:function(options){
			var tpl 
			= '<div class="fui-panel" id="{id.panel}" style="width:{width}px;height:{height}px">'
			+'    <div class="fui-panel-header {if move} fui-drag{/if}" id="{id.header}">'
			+'      <div class="fui-panel-header-inner">'
			+'        <div class="fui-panel-title">{#title||"&nbsp;"}</div>'
			+'        <div class="fui-panel-tools">'
			+'        {each buttons.header}<input type="button" value="{$value.title}" />{/each}'
			+'        </div>'
			+'      </div>'
			+'    </div>'
			+'    <div class="fui-panel-viewport" id="{id.viewport}">'
			+'      <div class="fui-panel-viewport-inner">{#content}</div>'
			+'    </div>'
			+'    <div class="fui-panel-footer" id="{id.footer}">'
			+'      <div class="fui-panel-footer-inner">'
			+'        {each buttons.footer}<input type="button" value="{$value.title}" />{/each}'
			+'      </div>'
			+'    </div>'
			+'  <div class="fui-panel-border">'+ border +'</div>'
			+'  {if resize}<div id="{id.resize}" class="fui-panel-resize"></div>{/if}'
			+'</div>';
			return tpl;
		},
		init:function(){
			var $el = $(this.el);
			var regions = $el.find('>div[region]');
			var extAttrs = ["minWidth","minHeight","maxWidth","maxHeight","split","region"];
			$(regions).each(function(){
				console.log(this);
			})
			
			// 获取模板渲染
			var tpl = this._getTemplate(options);
			this.panel = fui.template(tpl,this.options);
			
			return this;
		}
	});
})();
