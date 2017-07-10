# 欢迎使用 Feim

------


### 安装使用

```bash
npm install feim -g
```

### 初始化项目

```bash
cd path to /demo
feim init || feim i
```

### 编辑模板文件 - 项目结构

```bash
root
|-- static // 静态文件
|   |-- css // less文件
|   |-- datas // 资源或数据
|   |-- fonts // 字体文件
|   |-- images // 图片文件
|   |-- js // javascript文件
|   |-- lib // js或css库
|   |-- ... //可自行添加
|   
|-- templates // swig文件
|   |-- @layout.tpl // 模板
|   |-- header.tpl // 头部
|   |-- footer.tpl // 底部
|   |-- index.tpl // 首页
|
|-- config.json // 配置文件
```
### 生成项目文件到 /dist

```bash
feim build || feim b
```

### 合并css与js文件
```bash
feim concat || feim c
```
### 压缩css(minify)与js(uglify)文件
```bash
feim mini || feim m
```

### 清空dist目录
```bash
feim delete || feim d
```

# 关于配置
``` javascript
{
    //页面配置，在swig模板中可以使用 {{site.xxx}}
	"site":{ 
		"title":"Feiml", // 标题
		"author":"Anuny - http://yangfei.name", // 作者
		"siteurl":"http://www.yangfei.com", // 站点地址
		"keywords":"feim", // 关键词
		"description":"feim",// 描述
		"lang":"zh-cmn-Hans",// 语言
		"charset":"utf-8",// 字符编码
		"wap":true,// 是否WAP
		"siteApp":false// 是否禁止百度转码
		" ... " // 可自行添加或修改
	},
	// 系统配置
	"system":{
		"files":{
			"javascript":["*"], // 要合并的js顺序，如：["a.js","b.js","a/a.js","b/b.js"]
			"css":["*"] // 要合并的css文件顺序，如：["a.css","b.css","a/a.css","b/b.css"]
		},
		"cssPreFix":true, // 开启自动添加浏览器前缀
		"browsersVer":["last 2 versions", "Android >= 4.0","IE 7", "IE 8", "IE 9", "IE 10", "Firefox 14", "Opera 11.1"],// 浏览器前缀规则
		"watch":true, // 监听文件变化
		"openBrowser":true, // 自动打开浏览器
		"reloadBrowser":true, // 自动刷新浏览器
		"filter":"@", // 不编译或转移的文件
		"fix" : {
			"tpl"    : "{html,htm,tpl}", // 要编译的模板后缀
			"css"    : "{less,css}", // 要编译的less后缀
			"html"   : ".html"// 生成html文件后缀
		}
	} 
}
```

## License

MIT