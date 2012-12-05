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
			
			init : function(deskElem) {
				var container = WT.dom.createDiv(
					{"id" : "portal-" + this.id,
					"class" : "portal-container"},
					{"width" : this.width + "px",
					"height" : this.height + "px",
					"borderStyle" : "solid",
					"borderWidth" : "1px",
					"borderColor" : "#aaa",
					"backgroundColor" : "#fff",
					"position" : "absolute",
					"top" : "10px",
					"left" : "10px"
					}
				);
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
					"class" : "portal_title"},
					{"width" : "100%",
					"height" : "20px",
					"position" : "absolute",
					"top" : "0px",
					"left" : "0px",
					"borderBottomStyle" : "solid",
					"borderBottomWidth" : "1px",
					"borderBottomColor" : "#000",
					"backgroundColor" : "#ddd",
					"textIndent" : "4px",
					"lineHeight" : "18px"}
				);
				
				title.innerHTML = this.title;
				
				title.addEventListener("mousedown", function(event) {
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
						if(e.clientY - deltaY > 0) {
							portal.style.top = (e.clientY - deltaY) + "px";
						}
						
						e.stopPropagation();
					}

					function upHandler(e) {
						document.removeEventListener("mouseup", upHandler, true);
						document.removeEventListener("mousemove", moveHandler, true);
						e.stopPropagation();
					}
				}, true);
				
				this.topPadding += 21;
				return title;
			},
			
			generateContainer : function() {
				var cont = WT.dom.createDiv(
					{"id" : "portal_container-" + this.id,
					"class" : "portal_container"},
					{"position" : "absolute",
					"top" : this.topPadding + "px",
					"bottom" : this.bottomPadding + "px",
					"left" : "0px",
					"right" : "0px"}
				);
				
				return cont;
			},
			
			generateFooter : function() {
				var _this = this;
				var footer = WT.dom.createDiv(
					{"id" : "portal_footer-" + this.id,
					"class" : "portal_footer"},
					{"position" : "absolute",
					"width" : "100%",
					"bottom" : "0px",
					"height" : "16px",
					"backgroundColor" : "#ddd"}
				);
				
				var rsHandle = WT.dom.createDiv(
					{"id" : "portal_resize" + this.id,
					"class" : "portal_resize"},
					{"position" : "absolute",
					"width" : "16px",
					"height" : "inherit",
					"float" : "right",
					"right" : "0px",
					"borderLeftStyle" : "solid",
					"borderLeftWidth" : "1px",
					"borderLeftColor" : "#aaa"}
				);
				
				rsHandle.addEventListener("mousedown", function(event) {
					var portal = document.getElementById("portal-" + _this.id);
					console.log("Portal ID: " + _this.id + " resizing!");
					
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
						} else {
							portal.style.width = 70 + "px";
						}

						if (height > 70) {
							portal.style.height = height + "px";
						} else {
							portal.style.height = 70 + "px";
						}

						e.stopPropagation();
					}

					function upHandler(e) {
						document.removeEventListener("mouseup", upHandler, true);
						document.removeEventListener("mousemove", moveHandler, true);
						e.stopPropagation();
					}
				}, true);
				
				footer.appendChild(rsHandle);
				
				this.bottomPadding += 16;
				
				return footer;
			}
		};
		return portal;
	}	
};