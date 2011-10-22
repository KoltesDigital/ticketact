function(e) {
	var elem = $(this);
	
	db.view(design + '/users', {
		group: true,
		success: function(data) {
			var users = [];

			var userFound;
			$.each(data.rows, function(i, row) {
				users.push(row.key);
				if (row.key == userCtx.name) {
					userFound = true;
				}
			});

			if (!userFound && userCtx.name) {
				users.push(userCtx.name);
			}

			users.sort(caseInsensitiveSortOrder);

			addUsersToCache(users);
			
			var usersElem = elem.find('#users');

			$.each(cache.users, function(i, user) {
				usersElem.append($('<div/>').append($('<a/>').attr('href', '#user/' + user).text(user)));
			});
		}
	});

	ui();
}