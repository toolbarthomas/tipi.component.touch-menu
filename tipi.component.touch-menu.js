function setTouchMenu(origin) {
	var touchMenuElements = {
		root 				: 'touch-menu',
		button 				: 'touch-menu-button',
		dropdown 			: 'touch-menu-dropdown',
		drawer 				: 'touch-menu-drawer',
		helper 				: 'touch-menu-document-helper',
		helperWrapper 		: 'touch-menu-document-helper-wrapper'
	};

	var touchMenuStates = {
		ready 	: '__touch-menu--ready',
		active	: '__touch-menu--active'
	};

	var touchMenu = $('.' + touchMenuElements.root).not('.' + touchMenuStates.ready);
	if(touchMenu.length > 0) {

		touchMenu.each(function() {
			var touchMenu = $(this);
			var touchMenuButton = getTouchMenuElement('button', touchMenu, touchMenuElements);
			var touchMenuDropdown = getTouchMenuElement('dropdown', touchMenu, touchMenuElements);
			var touchMenuDrawer = getTouchMenuElement('drawer', touchMenu, touchMenuElements);

			if(touchMenuDropdown.length > 0 || touchMenuDrawer.length > 0) {
				touchMenu.addClass(touchMenuStates.ready);

				touchMenu.on({
					'tipi.touchMenu.toggle' : function(event, touchMenu) {
						toggleTouchMenu(touchMenu, touchMenuElements, touchMenuStates);
					}
				});

				touchMenuButton.on({
					click : function(event) {
						event.preventDefault();

						var touchMenu = getTouchMenuElement('root', $(this), touchMenuElements);
						touchMenu.trigger('tipi.touchMenu.toggle', [touchMenu]);
					}
				});
			}
		});
	}
}

function getTouchMenuElement(type, origin, elements) {
	if(typeof type != 'undefined' && typeof origin != 'undefined') {
		var element;

		switch(type) {
			case 'root':
				element = origin.parents('.' + elements.root).first();
			break;
			case 'button':
				element = origin.find('.' + elements.button).first();
			break;
			case 'dropdown':
				element = origin.find('.' + elements.dropdown).first();
			break;
			case 'drawer':
				element = origin.find('.' + elements.drawer).first();
			break;
			default:
				element = undefined;
		}

		return element;
	}
}

function toggleTouchMenu(touchMenu, touchMenuElements, touchMenuStates) {
	touchMenu.toggleClass(touchMenuStates.active);
}