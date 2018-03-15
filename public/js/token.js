$(document).ready(function () {
	var addToken = {
		getInformation: function (token, callback) {
			$.ajax({
				url: '/token/get-information/' + token,
				type: 'GET',
				dataType: 'json',
				success: function (data) {
					callback(data);
				},
				error: function (err) {
					callback(null);
				}
			})
		},

		add: function (token, information, callback) {
			$.ajax({
				url: '/token/add',
				type: 'POST',
				dataType: 'json',
				data: {
					token: token,
					information: information
				},
				success: function (data) {
					callback(data);
				},
				error: function (err) {
					console.log(err);
					callback(null);
				}
			})
		},

		delete: function (id, callback) {
			$.ajax({
				url: '/token/delete/' + id,
				type: 'GET',
				dataType: 'json',
				success: function (data) {
					callback(data);
				},
				error: function (err) {
					callback({status: false, msg: "Có lỗi trên server!"});
				}
			})
		},

		update: function (id, token, callback) {
			$.ajax({
				url: '/token/update',
				type: 'POST',
				dataType: 'json',
				data: {
					token: token,
					id: id
				},
				success: function (data) {
					callback(data);
				},
				error: function (err) {
					callback({status: false, msg: "Có lỗi trên server!"});
				}
			})
		}
	}

	function showLoading (status) {
		var display = status ? 'block' : 'none';
		$('.overlay-loader').css('display', display);
	}

	function showMessage (message) {
		alert(message);
	}

	$('.btn-load-information').click(function () {
		var token = $('textarea[name="token"]').val().trim();
		if (token) {
			showLoading(true);
			addToken.getInformation(token, function (data) {
				showLoading(false);
				console.log(data.data);
				if (data.status && data.data && data.data.id) {
					$('textarea[name="token"]').prop("disabled", true);
					$('.information-user').show();
					$('.btn-add-token').show();
					$('.btn-load-information').hide();
					$('.information-user textarea').val(JSON.stringify(data.data, undefined, 4));
				} else {
					showMessage("Token không hợp lệ!");
				}
			})
		} else {
			showMessage("Điền đầy đủ thông tin token!");
		}
	})

	$('.btn-add-token').click(function () {
		var token = $('textarea[name="token"]').val().trim();
		var information = $('.information-user textarea').val();
		information = JSON.stringify(JSON.parse(information));
		showLoading(true);
		addToken.add(token, information, function (data) {
			showLoading(false);
			if (data.status) {
				showMessage("Thêm token thành công!");
				location.reload();
			} else {
				showMessage(data.msg);
			}
		})
	})

	$('.btn-delete-token').click(function () {
		var id = $(this).data('value');
		if (confirm('Bạn có chắc chắn muốn xóa token này?')) {
			showLoading(true);
			addToken.delete(id, function () {
				location.reload();
			})
		}
	})

	$('.btn-update-token').click(function () {
		var token = $('textarea[name="token"]').val().trim();
		var id = $('input[name="id"]').val();
		if (!token) {
			showMessage("Điền đầy đủ thông tin token!");
		} else {
			addToken.update(id, token, function (data) {
				if (data.status) {
					showMessage("Sửa token thành công!");
				} else {
					showMessage(data.msg);
				}
			})
		}
	})
})