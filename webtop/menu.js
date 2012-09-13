/* WebTop Menu
 * -----------
 * This is a general object class for menus and menu items that populates them. This
 * is made to make menu generation a wee bit easier and to put an abstractionlevel to
 * menu items.
 * The items are created much like elements are created in the DOM and given event
 * listeners from the main application class.
 * The menu will be able to contain a mix of items with icons and checkboxes.
 */
WT.menu = {
	/* MenuBar
	 * The menubar is the main container for menus and menu items, this is the class that
	 * is used by the application.
	 */
	MenuBar : function() {
		var menubar = {
				
		};
		return menubar;
	},	
	
	/* Menu
	 * The main menu
	 */
	Menu : function() {
		var menu = {
				
		};
		return menu;
	},
	
	MenuItem : function() {
		var item = {
				
		};
		return item;
	},
	
	SubMenu : function() {
		var sub = {
				
		};
		
		return sub;
	}
};