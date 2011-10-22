function(e) {
	var elem = $(this);

	elem.find('#newVersion').submit(function() {
		var form = $(this);

		var name = form.find('[name=name]').val();

		if (name) {
			var version = {
				doctype: 'version',
				name: name,
				description: form.find('[name=description]').val()
			};

			db.saveDoc(version, {
				success: function() {
					$.pathbinder.go('version/' + version._id);
				}
			});
		}

		return false;
	});

	ui();
	elem.find('#newVersion [name=name]').focus();
}