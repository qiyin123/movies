/******************************wangEditor编辑器***************************/
$(function () {
	var E = window.wangEditor;
	// var editor = new E("comments");
	var editor = new E(document.getElementById('editor'));
	var $txtcontent = $('#txtcontent');
	var menulist = [
		'head',  // 标题
		'bold',  // 粗体
		'fontSize',  // 字号
		'fontName',  // 字体
		'italic',  // 斜体
		'underline',  // 下划线
		'strikeThrough',  // 删除线
		'foreColor',  // 文字颜色
		'backColor',  // 背景颜色
		'link',  // 插入链接
		'list',  // 列表
		'justify',  // 对齐方式
		'quote',  // 引用
		'emoticon',  // 表情
		'image',  // 插入图片
		'table',  // 表格
		'video',  // 插入视频
		'code',  // 插入代码
		'undo',  // 撤销
		'redo'  // 重复
	];
	// 自定义菜单配置
	editor.customConfig.menus = [
		'head',					// 标题
		'bold',					// 粗体
		'italic',				// 斜体
		'underline',		// 下划线
		'emoticon',  		// 表情
		'undo',  				// 撤销
	]
	editor.customConfig.onchange = function (html) {
		// 监控变化，同步更新到 textarea
	}
	editor.create()
	document.getElementById('btnsubmit').addEventListener('click', function () {
		var html = editor.txt.html();
		// 只允许span标签，该标签只允许style, class这两个属性
		var options = {
			whiteList: {
				span: ['style', 'class'],
				p: ['style', 'class'],
				img:['src','alt','data-w-e'],
				br:['*'],
				u:['style','class'],
				h:[],
				b:[],
				i:[]
			}
		};
		var filterHtml = filterXSS(html,options)  // 此处进行 xss 攻击过滤
		$txtcontent.val(filterHtml);
	}, false)
});