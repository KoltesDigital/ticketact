function(e) {
	var elem = $(this);
	var tr = elem.tr();

	var form = elem.find('#newTicket');

	form.find('[name=type]').change(function() {
		var type = cache.types[$(this).val()];

		if (type && type.favoriteBoard) {
			form.find('[name=board]').val(type.favoriteBoard).change();
		}
	});

	var boardSelect = form.find('[name=board]');
	form.find('[name=stage]').change(editableSelectChange);
	boardSelect.change(function() {
		var stageSelect = form.find('[name=stage]');
		if (stageSelect.is('select')) {
			stageSelect.empty();
		} else {
			var newStageSelect = $('<select/>');
			newStageSelect.change(editableSelectChange);
			stageSelect.after(newStageSelect).remove();
			stageSelect = newStageSelect;
			stageSelect.attr('name', 'stage');
		}

		var board = boardSelect.val();
		if (cache.boards[board]) {
			$.each(cache.boards[board].stages, function(i, stage) {
				stageSelect.append($('<option/>').attr('value', stage).text(stage));
			});
			stageSelect.append($('<option/>').text(tr('...')));
		} else {
			stageSelect.change();
		}
	}).change();

	form.submit(function() {
		var name = form.find('[name=name]').val();
		var board = form.find('[name=board]').val();
		var stage = form.find('[name=stage]').val();

		if (name && board && stage) {
			var currentTs = now();

			var ticket = {
				doctype: 'ticket',
				name: name,
				description: form.find('[name=description]').val(),
				created: currentTs,
				board: board,
				stage: stage
			};

			var type = form.find('[name=type]').val();
			if (type) {
				ticket.type = type;
			}

			var historyEntry = {
				date: currentTs,
				board: board,
				stage: stage
			};

			var assignee = form.find('[name=assignee]').val();
			if (assignee) {
				ticket.assignee = assignee;
				historyEntry.user = assignee;
				updateUserCache(assignee);
			}

			ticket.history = [historyEntry];

			db.saveDoc(ticket, {
				success: function() {
					$.pathbinder.go('ticket/' + ticket._id);
				}
			});
		}

		return false;
	});

	ui();
	form.find('[name=name]').focus();
}