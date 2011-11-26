function(e) {
	var elem = $(this);
	var tr = elem.tr();

	function showKanban(board, tickets) {
		var elem = $('#overview');
		elem.empty();

		if (board) {
			elem.append(tr('Selected board overview:'));
			
			var table = $('<table class="smallKanban"/>');
			elem.append(table);
	
			var thead = $('<tr/>');
			table.append($('<thead/>').append(thead));
	
			var tbody = $('<tr/>');
			table.append($('<tbody/>').append(tbody));
			
			var stages = {};
	
			$.each(board.stages, function(i, stage) {
				var th = $('<th/>');
				th.text(stage);
				thead.append(th);
	
				var td = $('<td/>');
				td.data('stage', stage);
				tbody.append(td);
	
				stages[stage] = td;
			});
	
			$.each(tickets, function(i, ticket) {
				var div = $('<div class="ui-state-highlight"/>').text(ticket.name);
	
				if (stages[ticket.stage]) {
					stages[ticket.stage].append(div);
				}
			});
		} else {
			elem.append(tr('Selected board does not exist.'));
		}
	}
	
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

		function noBoard() {
			showKanban();
			stageSelect.change();
		}
		
		var boardId = boardSelect.val();
		
		if (boardId) {
			db.openDoc(boardId, {
				success: function(board) {
					updateCache('boards', boardId, board);
					
					$.each(board.stages, function(i, stage) {
						stageSelect.append($('<option/>').attr('value', stage).text(stage));
					});
					stageSelect.append($('<option/>').text(tr('...'))).change();
					
					if (configuration.bugViewETagsIncludeDocs) {
						db.view(design + '/ticketsInBoards', {
							startkey: [boardId],
							endkey: [boardId, {}],
							reduce: false,
							success: function(resp) {
								var keys = [];
	
								$.each(resp.rows, function(i, row) {
									keys.push(row.id);
								});
	
								db.allDocs({
									keys: keys,
									include_docs: true,
									success: function(resp) {
										var tickets = [];
										
										$.each(resp.rows, function(i, row) {
											tickets.push(row.doc);
										});
										
										showKanban(board, tickets);
									}
								});
							}
						});
					} else {
						db.view(design + '/ticketsInBoards', {
							startkey: [boardId],
							endkey: [boardId, {}],
							reduce: false,
							include_docs: true,
							success: function(resp) {
								var tickets = [];
	
								$.each(resp.rows, function(i, row) {
									tickets.push(row.doc);
								});
								
								showKanban(board, tickets);
							}
						});
					}
				},
				error: noBoard
			});
		} else {
			noBoard();
		}
	});

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
				addUsersToCache(assignee);
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