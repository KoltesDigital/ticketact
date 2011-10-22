function(e) {
	var elem = $(this);

	elem.find('#newType').submit(function() {
		var form = $(this);

		var name = form.find('[name=name]').val();

		if (name) {
			var type = {
				doctype: 'type',
				name: name,
				description: form.find('[name=description]').val()
			};

			db.saveDoc(type, {
				success: function() {
					$.pathbinder.go('type/' + type._id);
				}
			});
		}

		return false;
	});

	ui();
	elem.find('#newType [name=name]').focus();
}