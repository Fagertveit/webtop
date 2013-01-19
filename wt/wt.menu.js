/* WebTop - Menu
 * --------------
 * A class that handles menu's and menu items, it will handle tool-bars as well
 * This will be the perfect test space to make event handlers work as I want
 * them to.
 * The general approach is that I create a container for the menu and populate
 * it with menu items that I connect with callback functions.
 * First I need to make a MenuBar, this will in turn be populated with menu's
 * who will be populated with menu items that will have callbacks.
 * The Tool-bar will instead have buttons that is connected with callbacks.
 * 
 * I need to start off with this and then implement additional functionality
 * to the classes, I might want special widgets for the tool-bar, and sub-menues
 * for the menu's.
 * --------------
 * Classes
 * ==============
 * MenuBar
 * ---------
 * This is the top parent for menu systems, it will have menu's as children that
 * will be placed in an array.
 * The menubar needs to have specific metrics.
 * * Height: 20px
 * ---------
 * Menu
 * ---------
 * This is the child of menu-bar, it will have menu items as children, placed
 * in an array.
 * ---------
 * MenuItem
 * ---------
 * This is the child of a menu, it holds a callback reference that will be
 * triggered when the user clicks on the item.
 * ---------
 * ToolBar
 * ---------
 * A container class for toolbar buttons, this is a bit different from the menu as it's
 * both higher in size and doesn't have any menus, but instead sports buttons and drop
 * down select boxes. I need to write a couple of custom items for this class, the WTEdit
 * application will be the perfect playmate to make this work out as planed.
 * The toolbar resides beneath the ordinary menubar and might span multiple rows depending
 * on the amount of tools that reside in it.
 */
WT.menu = {
	MenuBar : function(srcParent) {
		var menuBar = {
			parent : srcParent,
			menus : new Array(),
			
			generateMenuBar : function() {
				var mb = WT.dom.createDiv(
					{"id" : "menu_bar-" + this.parent.id,
					"class" : "menu_bar"}
				);
				
				return mb;
			},
			
			addMenu : function(title) {
				var menu = WT.menu.Menu(this, title);
				this.menus[menu.title] = menu;
				menu.generateMenu();
			},
			
			removeMenu : function(title) {
				delete this.menus[title];
				// Take away the dom items that is connected to the menu.
			},
			
			hideAll : function() {
				for(menu in this.menus) {
					this.menus[menu].hideMenu();
				}
			}
		};
		return menuBar;
	},	
		
	Menu : function(srcParent, srcTitle) {
		var menu = {
			parent : srcParent,
			items : new Array(),
			title : srcTitle || "Untitled",
			
			generateMenu : function() {
				var _this = this;
				//console.log("Top Parent: " + this.parent.parent.id);
				var elem = document.getElementById("menu_bar-" + this.parent.parent.id);
				var menu = WT.dom.createDiv(
					{"id" : "menu_" + this.title + "-" + this.parent.parent.id,
					"class" : "menu"}
				);
				
				var menuCont = WT.dom.createDiv(
					{"id" : "menu_container_" + this.title + "-" + this.parent.parent.id,
					"class" : "menu_container"},
					{"display" : "none"}
				);
				
				menu.addEventListener("click", function(event) {
					//console.log("Clicking menu: " + _this.title);
					_this.toogleMenu(event, _this);
				}, true);
				
				menu.appendChild(menuCont);
				
				menu.innerHTML = this.title;
				
				elem.appendChild(menu);
				menu.appendChild(menuCont);
			},
			
			addItem : function(title, callback) {
				var item = new WT.menu.MenuItem(this, title, callback);
				this.items[title] = item;
				item.generateMenuItem();
			},

			addSubMenu : function(title) {
				var subMenu = new WT.menu.Menu(this, title);
			},
			
			addDelimiter : function() {
				var cont = document.getElementById("menu_container_" + this.title + "-" + this.parent.parent.id);
				var delimiter = WT.dom.createDiv(
					{"class" : "menu_delimiter"}
				);
				cont.appendChild(delimiter);
			},
			
			removeItem : function() {
				
			},
			
			toogleMenu : function(event, _this) {
				var hidden = _this.isHidden();

				_this.parent.hideAll();
				
				if(hidden) {
					_this.showMenu();
				} else {
					_this.hideMenu();
				}
			},
			
			hideMenu : function() {
				var elem = document.getElementById("menu_container_" + this.title + "-" + this.parent.parent.id);
				elem.style.display = "none";
			},
			
			showMenu : function() {
				var _this = this;
				var elem = document.getElementById("menu_container_" + this.title + "-" + this.parent.parent.id);
				elem.style.display = "block";
				
				function checkActiveMenu(event) {
					var evtElem = event.target.getAttribute("id");
					console.log(evtElem);
					if(evtElem != "menu_container_" + _this.title + "-" + _this.parent.id ||
						evtElem != "menu_" + _this.title + "-" + _this.parent.parent.id) {
						_this.hideMenu();
					}
					
					document.removeEventListener("click", checkActiveMenu, true);
					
					event.preventDefault();
					event.stopPropagation();
				}
			},
			
			isHidden : function() {
				var elem = document.getElementById("menu_container_" + this.title + "-" + this.parent.parent.id);
				return elem.style.display == "none";
			}
		};
		return menu;
	},
	
	MenuItem : function(srcParent, srcTitle, srcCallback) {
		var menuItem = {
			parent : srcParent,
			title : srcTitle || "Untitled",
			callback : srcCallback || null,
			attr : null,
			
			generateMenuItem : function() {
				var _this = this;
				var cont = document.getElementById("menu_container_" + this.parent.title + "-" + this.parent.parent.parent.id);
				var elem = WT.dom.createDiv(
					{"id" : "menu_item_" + this.title + "-" + this.parent.parent.parent.id,
					"class" : "menu_item"}
				);
				
				elem.innerHTML = this.title;
				
				elem.addEventListener("click", function(event) {
					_this.trigger(event, _this);
				}, true);
				
				cont.appendChild(elem);
			},
			
			setAttributes : function(attributes) {
				this.attr = attributes;
			},
			
			setCallback : function(callback) {
				this.callback = callback;
			},
			
			trigger : function(event, _this) {
				if(_this.attr != null) {
					_this.callback(_this.attr);
				} else {
					_this.callback();
				}
			}
		};
		return menuItem;
	}
};