$(function () {
	$('.comment').click(function (e) {
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');

		if ($("#toId").length > 0) {
			$("#toId").val(toId);
		} else {
			$('<input>').attr({
				id: '#toId',
				type: 'hidden',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
		}
		if ($("#commentId").length > 0) {
			$("#commentId").val(commentId);
		} else {
			$('<input>').attr({
				id: '#commentId',
				type: 'hidden',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}
	});

	
})
var video = document.getElementById("video");
var current = false;

video.controls = true; //控制条

video.addEventListener("click", function () {
	if (current) {
		video.play()
		current = false  //下次点击的状态
	} else {
		video.pause()
		current = true
	}
})

