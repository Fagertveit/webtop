/* WebTop Portal
 * -------------
 * A Class that handles the default container of WebTop, the portals.
 * -------------
 * ToDo
 * -------------
 * * Fix resize handle and event listeners.
 * * Fix Z-Index event listeners on the main container (Will use Z-order from the desktop class).
 * * Fix Maximize, Minimize and Close listeners and gfx.
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
			
			init : function() {
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
				
				this.parent.appendChild(container);
			},
			
			generateTitleBar : function() {
				var _this = this;
				var title = WT.dom.createDiv(
					{"id" : "portal_title-" + this.id,
					"class" : "portal_title"},
					{"width" : "inherit",
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
					"width" : "inherit",
					"top" : this.topPadding + "px",
					"height" : this.height - (this.topPadding + this.bottomPadding) + "px"}
				);
				
				return cont;
			},
			
			generateFooter : function() {
				var footer = WT.dom.createDiv(
					{"id" : "portal_footer-" + this.id,
					"class" : "portal_footer"},
					{"position" : "absolute",
					"width" : "inherit",
					"top" : (this.height - 16) + "px",
					"height" : "16px",
					"backgroundColor" : "#ddd"}
				);
				
				this.bottomPadding += 16;
				
				return footer;
			}
		};
		return portal;
	}	
};