/* WebTop Portal
 * -------------
 * A Class that handles the default container of WebTop, the portals.
 * -------------
 * ToDo
 * -------------
 * V Fix resize handle and event listeners.
 * * Fix Z-Index event listeners on the main container (Will use Z-order from the desktop class).
 * * Fix Maximize, Minimize and Close listeners and gfx.
 * * Look into overriding the event listener functions so that I can implement event listeners
 * 	 that works on both desktop and mobile devices! (ie. mousedown becomes touchstart and such).
 */
WT.portal = {
	Portal : function(uid, srcParent, srcTitle) {
		var portal = {
			id : uid,
			parent : srcParent || null,
			title : srcTitle || "Untitled",
			width : 320,
			height : 240,
			titleBar : true,
			footer : true,
			topPadding : 0,
			bottomPadding : 0,
			menu : null,
			zIndex : 0,
			maximized : false,
			posX : 10,
			posY : 10,
			
			init : function(deskElem) {
				var _this = this;
				var container = WT.dom.createDiv(
					{"id" : "portal-" + this.id,
					"class" : "portal"},
					{"width" : this.width + "px",
					"height" : this.height + "px"
					}
				);
				
				container.addEventListener("click", function() { _this.parent.resortPortals(_this); }, true);
				
				container.appendChild(this.generateTitleBar());
				container.appendChild(this.generateFooter());
				container.appendChild(this.generateContainer());
				
				deskElem.appendChild(container);
				
				this.parent.log("Portal generated with ID: " + this.id);
			},
			
			generateTitleBar : function() {
				var _this = this;
				var title = WT.dom.createDiv(
					{"id" : "portal_title-" + this.id,
					"class" : "portal_title"}
				);
				
				var close = WT.dom.createDiv(
					{"id" : "portal_close-" + this.id,
					"class" : "portal_close portal_title_btn"}
				);
				
				close.innerHTML = "X";
				close.addEventListener("click", function() { _this.terminate(_this); }, true);
				
				var maximize = WT.dom.createDiv(
					{"id" : "portal_max-" + this.id,
					"class" : "portal_max portal_title_btn"}
				);
				
				maximize.innerHTML = "[]";
				maximize.addEventListener("click", function() { _this.maximize(_this); }, true);
				
				var minimize = WT.dom.createDiv(
					{"id" : "portal_min-" + this.id,
					"class" : "portal_min portal_title_btn"}
				);
				
				minimize.innerHTML = "_";
				minimize.addEventListener("click", function() { _this.minimize(_this); }, true);
				
				title.innerHTML = this.title;
				
				title.addEventListener("mousedown", function(event) {
					_this.move(event, _this);
				}, true);
				
				this.topPadding += 21;
				
				title.appendChild(close);
				title.appendChild(maximize);
				title.appendChild(minimize);
				
				return title;
			},
			
			generateContainer : function() {
				var cont = WT.dom.createDiv(
					{"id" : "portal_container-" + this.id,
					"class" : "portal_container"},
					{"top" : this.topPadding + "px",
					"bottom" : this.bottomPadding + "px"}
				);
				
				cont.innerHTML = '<a href="www.fagertveit.com" target="_blank">www.fagertveit.com</a>';
				
				return cont;
			},
			
			generateFooter : function() {
				var _this = this;
				var footer = WT.dom.createDiv(
					{"id" : "portal_footer-" + this.id,
					"class" : "portal_footer"}
				);
				
				var rsHandle = WT.dom.createDiv(
					{"id" : "portal_resize" + this.id,
					"class" : "portal_resize"}
				);
				
				rsHandle.addEventListener("mousedown", function(event) {
					_this.resize(event, _this);
				}, true);
				
				footer.appendChild(rsHandle);
				
				this.bottomPadding += 16;
				
				return footer;
			},
			
			setTopPadding : function(value) {
				this.topPadding += value;
				var elem = document.getElementById("portal_container-" + this.id);
				elem.style.top = this.topPadding + "px";
			},
			
			addMenuBar : function() {
				this.menu = new WT.menu.MenuBar(this);
				this.setTopPadding(20);
				var elem = document.getElementById("portal-" + this.id);
				elem.appendChild(this.menu.generateMenuBar());
			},
			
			addMenu : function(title) {
				this.menu.addMenu(title);
			},
			
			addMenuItem : function(menu, title, callback) {
				var _this = this;
				if(callback != undefined) {
					this.menu.menus[menu].addItem(title, callback);
				} else {
					this.menu.menus[menu].addItem(title, _this.testCallback);
				}
			},
			
			testCallback : function(msg) {
				console.log("Callback test for: " + msg);
			},
			
			setZIndex : function(zIndex) {
				var portal = document.getElementById("portal-" + this.id);
				this.zIndex = zIndex;
				
				portal.style.zIndex = this.zIndex;
			},
			
			resize : function(event, _this) {
				var portal = document.getElementById("portal-" + _this.id);
				//console.log("Portal ID: " + _this.id + " resizing!");
				
				var startX = event.clientX;
				var startY = event.clientY;

				var origX = portal.offsetLeft;
				var origY = portal.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				var startWidth = portal.style.width;
				startWidth = Number(startWidth.substr(0, startWidth.length - 2));
				
				var startHeight = portal.style.height;
				startHeight = Number(startHeight.substr(0, startHeight.length - 2));

				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					width = e.clientX - deltaX - origX + startWidth;
					height = e.clientY - deltaY - origY + startHeight;
					if (width > 70) {
						portal.style.width = width + "px";
						_this.width = width;
					} else {
						portal.style.width = 70 + "px";
						_this.width = 70;
					}

					if (height > 70) {
						portal.style.height = height + "px";
						_this.height = height;
					} else {
						portal.style.height = 70 + "px";
						_this.height = 70;
					}

					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			move : function(event, _this) {
				var id = _this.id;
				var portal = document.getElementById("portal-" + id);

				var startX = event.clientX;
				var startY = event.clientY;

				var origX = portal.offsetLeft;
				var origY = portal.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					portal.style.left = (e.clientX - deltaX) + "px";
					_this.posX = (e.clientX - deltaX);
					if(e.clientY - deltaY > 0) {
						portal.style.top = (e.clientY - deltaY) + "px";
						_this.posY = (e.clientY - deltaY);
					}
					
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			terminate : function(_this) {
				//console.log(_this);
				_this.parent.destroyPortal(_this);
			},
			
			maximize : function(_this) {
				console.log("Maximize: Portal-" + _this.id);
				var elem = document.getElementById("portal-" + _this.id);
				if(_this.maximized) {
					elem.style.width = _this.width + "px";
					elem.style.height = _this.height + "px";
					elem.style.left = _this.posX + "px";
					elem.style.top = _this.posY + "px";
					_this.maximized = false;
				} else {
					elem.style.width = _this.parent.width + "px";
					elem.style.height = (_this.parent.height - 32) + "px";
					elem.style.left = "0px";
					elem.style.top = "0px";
					_this.maximized = true;
				}
			},
			
			minimize : function(_this) {
				console.log("Minimize: Portal-" + _this.id);
			}
		};
		return portal;
	}	
};