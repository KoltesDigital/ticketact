function(e) {
	var elem = $(this);

	elem.find('#newComponent').submit(function() {
		var form = $(this);

		var name = form.find('[name=name]').val();

		if (name) {
			var component = {
				doctype: 'component',
				name: name,
				description: form.find('[name=description]').val()
			};

			db.saveDoc(component, {
				success: function() {
					$.pathbinder.go('component/' + component._id);
				}
			});
		}

		return false;
	});

	ui();
	elem.find('#newComponent [name=name]').focus();
}