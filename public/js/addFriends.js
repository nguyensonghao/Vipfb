$(document).ready(function () {
	$('form').submit(function (e) {
		e.stopPropagation();
		e.preventDefault();
		var token = $('textarea[name="token"]').val().trim();
		var userId = $('input[name="userId"]').val().trim();
		if (!token || !userId) {
			showMessage('Điền đầy đủ thông tin người dùng')
		} else {
			showLoading(true);
			console.log("Send request ajax to add friends!");
			$.ajax({
				url: '/api/add-friend',
				type: 'POST',
				dataType: 'json',
				data: {
					token: token,
					userId: userId
				},
				success: function (data) {
					showLoading(false);
					if (data.status) {
						showMessage("Thêm lời mời kết bạn thành công!");
						location.reload();
					} else {
						showMessage("Có lỗi trên server!");	
					}
				},
				error: function (err) {
					showLoading(false);
					showMessage("Có lỗi trên server!");
					console.log(err);
				}
			})
		}
	})

	$('.list-token li').click(function () {
		$('.list-token li').removeClass('active');
		$(this).addClass('active');
		var token = $(this).text().trim();
		// console.log(token);
		$('textarea[name="token"]').val(token);
	})

	function showLoading (status) {
		var display = status ? 'block' : 'none';
		$('.overlay-loader').css('display', display);
	}

	function showMessage (message) {
		alert(message);
	}
})