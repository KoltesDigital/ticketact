var icons = {
	'add': 'plus',
	'change': 'refresh',
	'create': 'check',
	'deal': 'play',
	'delete': 'trash',
	'down': 'arrowthick-1-s',
	'edit': 'pencil',
	'redeal': 'refresh',
	'remove': 'minus',
	'resume': 'seek-next',
	'save': 'disk',
	'stop': 'cancel',
	'up': 'arrowthick-1-n'
};

var configuration;

function editableSelectChange() {
	var sel = $(this);
	var last = sel.children(':last');
	if (last.length == 0 || last.attr('selected')) {
		var input = $('<input type="text" style="display: inline"/>');
		input.attr('name', sel.attr('name'));
		input.addClass(sel.attr('class'));
		sel.after(input);
		sel.remove();
		input.focus();
	}
}

function ui(elem) {
	var elem = $(elem || '#main');
	var tr = elem.tr();

	elem.children('h1').addClass('ui-widget-header ui-corner-top');
	elem.children('div').addClass('ui-widget-content ui-corner-bottom');

	elem.find('form.fields').each(function() {
		var form = $(this);

		var div = $('<div/>');
		form.append(div);

		var edit = $('<button/>');
		edit.attr('type', 'button');
		edit.data('icon', 'edit');
		edit.text(tr('Edit'));
		div.append(edit);

		var save = $('<button/>');
		save.attr('type', 'submit');
		save.data('icon', 'save');
		save.text(tr('Save'));
		div.append(save);
		save.hide();

		var cancel = $('<button/>');
		cancel.attr('type', 'button');
		cancel.data('icon', 'cancel');
		cancel.text(tr('Cancel'));
		div.append(cancel);
		cancel.hide();

		edit.click(function() {
			edit.toggle();
			save.toggle();
			cancel.toggle();

			form.find('.text,.editor').toggle();

			form.trigger('toggled');

			form.find(':input:first').focus();
		});

		cancel.click(function() {
			edit.toggle();
			save.toggle();
			cancel.toggle();

			form.find('.text,.editor').toggle();
		});

		form.submit(function() {
			save.button('disable');
			cancel.hide();
			form.find(':input').attr('disabled', true);
		});
	});

	elem.find('button').each(function() {
		var elem = $(this);

		var primaryIcon = elem.data('icon') || elem.data('primary-icon');
		var secondaryIcon = elem.data('secondary-icon');

		elem.button({
			text: elem.text() || false,
			icons: {
				primary: primaryIcon && 'ui-icon-' + (icons[primaryIcon] || primaryIcon),
				secondary: secondaryIcon && 'ui-icon-' + (icons[secondaryIcon] + secondaryIcon)
			}
		});
	});

	elem.find('select.editable').append($('<option/>').text(tr('...'))).change(editableSelectChange);
}

$(function() {
	$.couch.app(function(app) {
		configuration = app.ddoc.configuration;

		$('#account').evently('account', app);
		$('#menu').evently('menu', app);
		$('#main').evently('tickets', app);
		$.pathbinder.begin('home');
	});

	var themeswitcher = $('#themeswitcher');
	if (themeswitcher.themeswitcher) {
		themeswitcher.themeswitcher();
	}
});