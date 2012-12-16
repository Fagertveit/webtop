/* WebTop Portal
 * -------------
 * A Class that handles the default container of WebTop, the portals.
 * -------------
 * ToDo
 * -------------
 * V Fix resize handle and event listeners.
 * V Fix Z-Index event listeners on the main container (Will use Z-order from the desktop class).
 * V Fix Maximize, Minimize and Close listeners and gfx.
 *  * When stepping out from minimize, check if the maximize is active, if so, go to maximized state
 *    instead of normal.
 * * Look into overriding the event listener functions so that I can implement event listeners
 * 	 that works on both desktop and mobile devices! (ie. mousedown becomes touchstart and such).
 * * Redraw DOM looks like urk in FireFox.
 */
WT.portal = {
	Portal : function(uid, srcParent, srcTitle, srcWidth, srcHeight) {
		var portal = {
			id : uid,
			parent : srcParent || null,
			title : srcTitle || "Untitled",
			width : srcWidth || 320,
			height : srcHeight || 240,
			titleBar : true,
			footer : true,
			topPadding : 0,
			bottomPadding : 0,
			menu : null,
			zIndex : 0,
			maximized : false,
			minimized : false,
			active : true,
			posX : 10,
			posY : 10,
			subPortals : new Array(),
			
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
				
				var handle = WT.dom.createDiv(
					{"id" : "portal_title_handle-" + this.id,
					"class" : "portal_title_handle"}
				);
				
				var icon = WT.dom.createDiv(
					{"id" : "portal_icon-" + this.id,
					"class" : "portal_icon"},
					{"backgroundImage" : "url('img/wt_icon_chainsaw.png')"}
				);
				
				var close = WT.dom.createDiv(
					{"id" : "portal_close-" + this.id,
					"class" : "portal_close portal_title_btn"}
				);
				
				close.innerHTML = "X";
				
				var maximize = WT.dom.createDiv(
					{"id" : "portal_max-" + this.id,
					"class" : "portal_max portal_title_btn"}
				);
				
				maximize.innerHTML = "[]";
				
				var minimize = WT.dom.createDiv(
					{"id" : "portal_min-" + this.id,
					"class" : "portal_min portal_title_btn"}
				);
				
				minimize.innerHTML = "_";
				
				title.innerHTML = this.title;
				if(WT.IS_MOBILE) {
					close.addEventListener("touchstart", function() { _this.terminate(_this); }, true);
					maximize.addEventListener("touchstart", function() { _this.maximize(_this); }, true);
					minimize.addEventListener("touchstart", function() { _this.minimize(_this); }, true);
					handle.addEventListener("touchstart", function(event) {
						_this.moveTouch(event, _this);
					}, true);
				} else {
					close.addEventListener("click", function() { _this.terminate(_this); }, true);
					maximize.addEventListener("click", function() { _this.maximize(_this); }, true);
					minimize.addEventListener("click", function() { _this.minimize(_this); }, true);
					handle.addEventListener("mousedown", function(event) {
						_this.move(event, _this);
					}, true);
				}
				
				this.topPadding += 29;
				
				title.appendChild(close);
				title.appendChild(maximize);
				title.appendChild(minimize);
				title.appendChild(handle);
				title.appendChild(icon);
				
				return title;
			},
			
			generateContainer : function() {
				var cont = WT.dom.createDiv(
					{"id" : "portal_container-" + this.id,
					"class" : "portal_container"},
					{"top" : this.topPadding + "px",
					"bottom" : this.bottomPadding + "px"}
				);
				
				//cont.innerHTML = WT.IS_MOBILE;
				
				return cont;
			},
			
			generateFooter : function() {
				var _this = this;
				var footer = WT.dom.createDiv(
					{"id" : "portal_footer-" + this.id,
					"class" : "portal_footer"}
				);
				
				var status = WT.dom.createDiv(
					{"id" : "portal_status-" + this.id,
					"class" : "portal_status"}
				);
				
				var rsHandle = WT.dom.createDiv(
					{"id" : "portal_resize-" + this.id,
					"class" : "portal_resize"}
				);
				
				if(WT.IS_MOBILE) {
					rsHandle.addEventListener("touchstart", function(event) {
						_this.resizeTouch(event, _this);
					}, true);
				} else {
					rsHandle.addEventListener("mousedown", function(event) {
						_this.resize(event, _this);
					}, true);
				}
				
				
				footer.appendChild(status);
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
				// Need to set Z-Index on menu containers so that subportals don't get in their way.
				var portal = document.getElementById("portal-" + this.id);
				this.zIndex = zIndex;
				
				for(portals in this.subPortals) {
					this.subPortals[portals].setZIndex(zIndex + 1);
				}
				
				portal.style.zIndex = this.zIndex;
			},
			
			setStatus : function(content) {
				var elem = document.getElementById("portal_status-" + this.id);
				elem.innerHTML = content;
			},
			
			addSubPortal : function(title) {
				var sub = new WT.portal.SubPortal(this, title);
				var nextId = this.subPortals.length;
				sub.id = nextId;
				sub.init();
				this.subPortals.push(sub);
				this.setZIndex(this.zIndex);
				// Return the subPortal id for Application reference.
				return sub;
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
			
			resizeTouch : function(event, _this) {
				var portal = document.getElementById("portal-" + _this.id);
				
				if(event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];
				}
				
				var startX = touch.clientX;
				var startY = touch.clientY;

				var origX = portal.offsetLeft;
				var origY = portal.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				var startWidth = portal.style.width;
				startWidth = Number(startWidth.substr(0, startWidth.length - 2));
				
				var startHeight = portal.style.height;
				startHeight = Number(startHeight.substr(0, startHeight.length - 2));

				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					var t = e.targetTouches[0];
					width = t.clientX - deltaX - origX + startWidth;
					height = t.clientY - deltaY - origY + startHeight;
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
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			move : function(event, _this) {
				if(_this.maximized) {
					return 0;
				}
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
			
			moveTouch : function(event, _this) {
				if(_this.maximized) {
					return 0;
				}
				
				if(event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];
				}
				
				var id = _this.id;
				var portal = document.getElementById("portal-" + id);

				var startX = touch.clientX;
				var startY = touch.clientY;

				var origX = portal.offsetLeft;
				var origY = portal.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					var t = e.targetTouches[0];
					portal.style.left = (t.clientX - deltaX) + "px";
					_this.posX = (t.clientX - deltaX);
					if(t.clientY - deltaY > 0) {
						portal.style.top = (t.clientY - deltaY) + "px";
						_this.posY = (t.clientY - deltaY);
					}
					
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			toggleResize : function(active) {
				var resize = document.getElementById("portal_resize-" + this.id);
				if(active) {
					resize.style.display = "block";
				} else {
					resize.style.display = "none";
				}
			},
			
			terminate : function(_this) {
				//console.log(_this);
				for(sub in _this.subPortals) {
					_this.subPortals[sub].terminate(_this.subPortals[sub]);
				}
				_this.parent.destroyPortal(_this);
			},
			
			maximize : function(_this) {
				var elem = document.getElementById("portal-" + _this.id);
				
				if(_this.maximized) {
					WT.anim.animateElement(elem,
						{
							"width" : {"start" : (_this.parent.width - 2), "end" : _this.width},
							"height" : {"start" : (_this.parent.height - 35), "end" : _this.height},
							"top" : {"start" : 0, "end" : _this.posY},
							"left" : {"start" : 0, "end" : _this.posX}
						},
						WT.ANIM_DELAY
					);
					_this.toggleResize(true);
					_this.maximized = false;
				} else {
					WT.anim.animateElement(elem,
						{
							"width" : {"start" : _this.width, "end" : (_this.parent.width - 2)},
							"height" : {"start" : _this.height, "end" : (_this.parent.height - 35)},
							"top" : {"start" : _this.posY, "end" : 0},
							"left" : {"start" : _this.posX, "end" : 0}
						},
						WT.ANIM_DELAY
					);
					_this.toggleResize(false);
					_this.maximized = true;
				}
			},
			
			minimize : function(_this) {
				//console.log("Minimize: Portal-" + _this.id);
				var elem = document.getElementById("portal-" + _this.id);
				var handle = document.getElementById("portal_handle-" + _this.id);
				var endX, endY, endWidth, endHeight;
				endWidth = handle.clientWidth;
				endHeight = handle.clientHeight;
				endX = handle.offsetLeft;
				endY = (_this.parent.height - 32);
				
				//console.log("End Values: X: " + endX + " Y: " + endY + " Width: " + endWidth + " Height: " + endHeight);
				
				if(_this.minimized) {
					if(_this.maximized) {
						WT.anim.animateElement(elem,
							{
								"width" : {"start" : endWidth, "end" : (_this.parent.width - 2)},
								"height" : {"start" : endHeight, "end" : (_this.parent.height - 35)},
								"top" : {"start" : endY, "end" : 0},
								"left" : {"start" : endX, "end" : 0}
							},
							WT.ANIM_DELAY
						);
					} else {
						WT.anim.animateElement(elem,
							{
								"width" : {"start" : endWidth, "end" : _this.width},
								"height" : {"start" : endHeight, "end" : _this.height},
								"top" : {"start" : endY, "end" : _this.posY},
								"left" : {"start" : endX, "end" : _this.posX}
							},
							WT.ANIM_DELAY
						);
					}
					_this.minimized = false;
					for(subportal in _this.subPortals) {
						_this.subPortals[subportal].show(_this.subPortals[subportal]);
					}
				} else {
					WT.anim.animateElement(elem,
						{
							"width" : {"start" : _this.width, "end" : endWidth},
							"height" : {"start" : _this.height, "end" : endHeight},
							"top" : {"start" : _this.posY, "end" : endY},
							"left" : {"start" : _this.posX, "end" : endX}
						},
						WT.ANIM_DELAY
					);
					_this.minimized = true;
					for(subportal in _this.subPortals) {
						_this.subPortals[subportal].hide(_this.subPortals[subportal]);
					}
				}
			},
			
			repaint : function(_this) {
				var elem = document.getElementById("portal-" + _this.id);
				elem.style.display = "none";
				elem.style.display = "block";
			}
		};
		return portal;
	},
	/* ------------
	 * SubPortal
	 * ------------
	 * The subportal is used to generate lightweight portals to go with a main portal, so these little
	 * buggers will be created through the parent portal.
	 * Subportals will have less options of interaction than their big brother, mostly their size will
	 * be static, and you will only be able to move them around through it's title bar.
	 * Some portals will have the option to hide, usually the main portal will be able to show and hide
	 * this through it's menu.
	 * 
	 * Subportals will be used to host such things as tools and palettes as well as widgets that goes
	 * with the main application, Navigation window, info, data input and such.
	 * They can also be used as a base for alert, confirm and input windows.
	 */
	SubPortal : function(srcParent, srcTitle) {
		var sub = {
			id : 0,
			parent : srcParent || null,
			title : srcTitle || "Untitled",
			width : 80,
			height : 120,
			titleBar : true,
			footer : false,
			close : true,
			hidden : false,
			killOnClose : false,
			topPadding : 0,
			bottomPadding : 0,
			
			init : function() {
				var parentElem = this.parent.parent.container;
				var elem = WT.dom.createDiv(
					{"id" : "subportal-" + this.id + "-" + this.parent.id,
					"class" : "subportal"},
					{"width" : this.width + "px",
					"height" : this.height + "px"}
				);
				if(this.titleBar) {
					elem.appendChild(this.generateTitle());
				}
				elem.appendChild(this.generateContainer());
				if(this.footer) {
					elem.appendChild(this.generateFooter());
				}
				parentElem.appendChild(elem);
				
				this.parent.setZIndex(this.parent.zIndex);
			},
		
			generateTitle : function() {
				var _this = this;
				var title = WT.dom.createDiv(
					{"id" : "subportal_title-" + this.id + "-" + this.parent.id,
					"class" : "subportal_title"}
				);
				
				title.innerHTML = this.title;
				
				if(this.close) {
					var close = WT.dom.createDiv(
						{"id" : "subportal_title_close-" + this.id + "-" + this.parent.id,
						"class" : "subportal_title_btn"}
					);
					
					close.innerHTML = "X";
					
					close.addEventListener("click", function() {_this.hide(_this);}, true);
					title.appendChild(close);
				}
				
				title.addEventListener("mousedown", function(event) { _this.move(event, _this); }, true);
				
				return title;
			},
			
			generateContainer : function() {
				var container = WT.dom.createDiv(
					{"id" : "subportal_container-" + this.id + "-" + this.parent.id,
					"class" : "subportal_container"}
				);
				
				return container;
			},
			
			generateFooter : function() {
				var footer = WT.dom.createDiv(
					{"id" : "subportal_footer-" + this.id + "-" + this.parent.id,
					"class" : "subportal_footer"} 
				);
				
				return footer;
			},
			
			setWidth : function(width) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.width = width + "px";
			},
			
			setHeight : function(height) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.height = height + "px";
			},
			
			setSize : function(width, height) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.width = width + "px";
				cont.style.height = height + "px";
			},
			
			setPosition : function(x, y) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.top = y + "px";
				cont.style.left = x + "px";
			},
			
			setOnClose : function(terminate) {
				this.killOnClose = terminate;
			},
			
			move : function(event, _this) {
				var id = _this.id;
				var parent = _this.parent;
				var portal = document.getElementById("subportal-" + id + "-" + parent.id);

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
					//if(e.clientY - deltaY > 0) {
					portal.style.top = (e.clientY - deltaY) + "px";
					//}
					
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			setZIndex : function(zIndex) {
				var elem = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				this.zIndex = zIndex;
				elem.style.zIndex = zIndex;
			},
			
			toggle : function() {
				if(this.isHidden()) {
					this.show(this);
				} else {
					this.hide(this);
				}
			},
			
			isHidden : function() {
				var elem = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				return elem.style.display == "none";
			},
			
			hide : function(_this) {
				var elem = document.getElementById("subportal-" + _this.id + "-" + _this.parent.id);
				elem.style.display = "none";
				if(_this.killOnClose) {
					_this.terminate(_this);
				}
			},
			
			show : function(_this) {
				var elem = document.getElementById("subportal-" + _this.id + "-" + _this.parent.id); 
				elem.style.display = "block";
			},
			
			terminate : function(_this) {
				_this.parent.parent.destroySubPortal(_this);
			}
		};
		return sub;
	},
	
	Dialog : function() {
		var dialog = {
			id : 0,
			parent : srcParent || null,
			title : srcTitle || "Untitled",
			width : 80,
			height : 120,
			titleBar : true,
			close : true,
			topPadding : 0,
			bottomPadding : 0,
				
			init : function() {
				var parentElem = this.parent.parent.container;
				var elem = WT.dom.createDiv(
					{"id" : "subportal-" + this.id + "-" + this.parent.id,
					"class" : "subportal"},
					{"width" : this.width + "px",
					"height" : this.height + "px"}
				);
				if(this.titleBar) {
					elem.appendChild(this.generateTitle());
				}
				elem.appendChild(this.generateContainer());
					
				parentElem.appendChild(elem);
					
				this.parent.setZIndex(this.parent.zIndex);
			},
			
			generateTitle : function() {
				var _this = this;
				var title = WT.dom.createDiv(
					{"id" : "subportal_title-" + this.id + "-" + this.parent.id,
					"class" : "subportal_title"}
				);
					
				title.innerHTML = this.title;
					
				if(this.close) {
					var close = WT.dom.createDiv(
						{"id" : "subportal_title_close-" + this.id + "-" + this.parent.id,
						"class" : "subportal_title_btn"}
					);
						
					close.innerHTML = "X";
						
					close.addEventListener("click", function() {_this.hide(_this);}, true);
					title.appendChild(close);
				}
					
				title.addEventListener("mousedown", function(event) { _this.move(event, _this); }, true);
					
				return title;
			},
				
			generateContainer : function() {
				var container = WT.dom.createDiv(
					{"id" : "subportal_container-" + this.id + "-" + this.parent.id,
					"class" : "subportal_container"}
				);
					
				return container;
			},
				
			setWidth : function(width) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.width = width + "px";
			},
				
			setHeight : function(height) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.height = height + "px";
			},
				
			setPosition : function(x, y) {
				var cont = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				cont.style.top = y + "px";
				cont.style.left = x + "px";
			},
				
			move : function(event, _this) {
				var id = _this.id;
				var parent = _this.parent;
				var portal = document.getElementById("subportal-" + id + "-" + parent.id);

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
						//if(e.clientY - deltaY > 0) {
					portal.style.top = (e.clientY - deltaY) + "px";
						//}
						
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
				
			setZIndex : function(zIndex) {
				var elem = document.getElementById("subportal-" + this.id + "-" + this.parent.id);
				this.zIndex = zIndex;
				elem.style.zIndex = zIndex;
			},
				
			terminate : function(_this) {
				_this.parent.parent.destroySubPortal(_this);
			}
		};
		return dialog;
	}
};