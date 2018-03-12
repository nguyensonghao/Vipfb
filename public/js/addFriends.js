$(document).ready(function () {
	$('form').submit(function (e) {
		e.stopPropagation();
		e.preventDefault();
		var token = $('input[name="token"]').val();
		var userId = $('input[name="userId"]').val();
		if (!token || !userId) {
			alert('Điền đầy đủ thông tin người dùng')
		} else {
			console.log("Send request ajax to add friends!");
		}
	})
})