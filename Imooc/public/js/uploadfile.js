$(function () {
	var uploadUrl = '/admin/user/update/uploadHeadPortrait';
	var options = {
		language: 'zh', //设置语言
		uploadUrl: uploadUrl, //上传的地址
		allowedFileExtensions: ['jpg', 'png', 'gif'], //接收的文件后缀
		// uploadAsync: true, //默认异步上传
		// showUpload: false, //是否显示上传按钮
		// showRemove: true, //显示移除按钮
		// showCaption: false, //是否显示标题
		// dropZoneEnabled: true, //是否显示拖拽区域
		minImageWidth: 50, //图片的最小宽度
		minImageHeight: 50,//图片的最小高度
		maxImageWidth: 1000,//图片的最大宽度
		maxImageHeight: 1000,//图片的最大高度
		//maxFileSize:0,//单位为kb，如果为0表示不限制文件大小
		//minFileCount: 0,
		maxFileCount: 10, //表示允许同时上传的最大文件个数
		enctype: 'multipart/form-data',
		browseClass: "btn btn-default", //按钮样式: btn-default、btn-primary、btn-danger、btn-info、btn-warning
		previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
		initialPreview: [
		],
		uploadExtraData: function () {//向后台传递参数
			var data = {
				userId: $("#userId").val()
			};
			return data;
		}	
	}
	//初始化fileinput
	var fileInput = new FileInput();
	var imgUrl = $('#inputHeadPortrait')[0].defaultValue;
	var previews = "<img src='" + imgUrl +"' class='file-preview-image' style='width:150px;' />";
	options.initialPreview.push(previews);
	fileInput.Init("inputHeadPortrait", options);
});
//初始化fileinput
var FileInput = function () {
	var oFile = new Object();
	//初始化fileinput控件（第一次初始化）
	oFile.Init = function (ctrlName, options) {
		var control = $('#' + ctrlName);
	
		//初始化上传控件的样式
		control.fileinput(options).on('fileuploaded', function (event, data) {
			if (data.response) {
				console.log(data.response);
			}
		});
		
	}
	return oFile; //这里必须返回oFile对象，否则FileInput组件初始化不成功
}