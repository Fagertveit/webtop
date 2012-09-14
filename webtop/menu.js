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
	MenuBar : function(parId) {
		var menubar = {
			parent : parId,
			menus : new Array(),
				
			init : function() {
				
			},
		
			generateMenuBar : function() {
				var container = document.createElement("div");
				container.setAttribute("class", "menubar");
				container.setAttribute("id", "menubar-" + this.parent);
				
				return container;
			},
			
			addMenu : function(label) {
				var temp = new WT.menu.Menu(label, this.parent);
				temp.init();
				
				this.menus[label] = temp;
			}
		};
		return menubar;
	},	
	
	/* Menu
	 * The main menu
	 */
	Menu : function(srcLabel, srcPar) {
		var menu = {
			parent : srcPar,
			label : srcLabel,
			menuItems : new Array(),
			
			init : function() {
				this.generateMenu();
			},
			
			generateMenu : function() {
				
			}
		};
		return menu;
	},
	
	MenuItem : function() {
		var item = {
			parent : srcPar,
			
			init : function() {
				
			}
		};
		return item;
	},
	
	SubMenu : function() {
		var sub = {
			parent : srcPar,
			items : new Array(),
			
			init : function() {
				
			}
		};
		return sub;
	}
};