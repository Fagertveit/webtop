/* WebTop Portal
 * -------------
 * Portals is the WebTop version of windows, the word Window is already taken, so I had to come up
 * with an alternative. Portals are containers for applications in WebTop and all portals are
 * children of the WebTop Desktop object.
 * I will extend on the functionality of portals as development proceds, I would like to be able
 * to create sub portals that have other portals as their parents, but this system needs some think
 * through.
 * The portals also should have basic window functionality, such as move, resize, minimize, maximize
 * close and z-indexing.
 * 
 */
WT.portal = {
	Portal : function(srcWidth, srcHeight, srcParent, srcId, srcFixed, srcFooter, srcTitle) {
		var portal = {
			width : srcWidth || 320,
			height : srcHeight || 240,
			parent : srcParent || null,
			id : srcId,
			fixed : srcFixed || false,
			foot : srcFooter || false,
			title : srcTitle || "Untitled",
			zIndex : 10,

			init : function() {
				var parentElem, container;
				if (this.parent != null) {
					parentElem = document.getElementById(this.parent);
				} else {
					parentElem = document.body;
				}
				
				if(this.footer || !this.fixed) {
					this.height += 34;
				} else {
					this.height += 18;
				}
				
				var close = document.createElement("div");
				var max = document.createElement("div");
				var min = document.createElement("div");

				container = document.createElement("div");
				container.setAttribute("id", "portal-" + this.id);
				container.setAttribute("class", "portal");
				container.setAttribute("portalid", this.id);
				container.style.top = "100px";
				container.style.left = "10px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";
				container.addEventListener("click", WT.Desk.moveToFront, true);
				
				close.setAttribute("class", "close");
				close.addEventListener("click", this.close, true);
				min.setAttribute("class", "min");
				max.setAttribute("class", "max");

				container.appendChild(this.generateTitle());
				container.appendChild(this.generateContainer());
				
				if(this.foot) {
					container.appendChild(this.generateFoot());
				}
				
				if(!this.fixed) {
					container.appendChild(this.generateHandle());
				}
				
				container.appendChild(close);
				container.appendChild(min);
				if(!this.fixed) {
					container.appendChild(max);
				}

				parentElem.appendChild(container);

				this.id = WT.nextId;
				WT.nextId++;
			},

			generateTitle : function() {
				var title = document.createElement("div");
				var text = document.createElement("div");
				var titleHandle = document.createElement("div");
				

				title.setAttribute("id", "portal-titlebar-" + this.id);
				title.setAttribute("class", "title");
				/*title.setAttribute("style",
					"background-image: -webkit-linear-gradient(top, #aae, #55a 80%, #aaf 85%);" +
					"background-image: -moz-linear-gradient(top, #aae, #55a 80%, #aaf 85%);" +
					"background-image: -ms-linear-gradient(top, #aae, #55a 80%, #aaf 85%);" +
					"background-image: -o-linear-gradient(top, #aae, #55a 80%, #aaf 85%);" +
					"background-image: linear-gradient(top, #aae, #55a 80%, #aaf 85%);"	
					);*/
				title.setAttribute("style",
						"background-image: -webkit-linear-gradient(top, rgb(98, 216, 161) 0%, rgb(233, 238, 239) 82%, rgb(171, 211, 130) 83%, rgb(223, 217, 228) 100%);" +
						"background-image: -moz-linear-gradient(top, rgb(98, 216, 161) 0%, rgb(233, 238, 239) 82%, rgb(171, 211, 130) 83%, rgb(223, 217, 228) 100%);" +
						"background-image: -ms-linear-gradient(top, rgb(98, 216, 161) 0%, rgb(233, 238, 239) 82%, rgb(171, 211, 130) 83%, rgb(223, 217, 228) 100%);" +
						"background-image: -o-linear-gradient(top, rgb(98, 216, 161) 0%, rgb(233, 238, 239) 82%, rgb(171, 211, 130) 83%, rgb(223, 217, 228) 100%);" +
						"background-image: linear-gradient(top, rgb(98, 216, 161) 0%, rgb(233, 238, 239) 82%, rgb(171, 211, 130) 83%, rgb(223, 217, 228) 100%);"
					);

				title.addEventListener("mousedown", this.move, true);
				title.addEventListener("touchstart", this.moveTouch, true);

				text.setAttribute("id", "portal-title-" + this.id);
				text.innerHTML = this.title;
				text.style.position = "absolute";
				text.style.left = 4 + "px";
				text.style.top = 2 + "px";
				text.style.fontSize = 12 + "px";
				text.style.color = "#000";
				
				titleHandle.setAttribute("id", "portal-titlehandle-" + this.id);
				titleHandle.style.height = 18 + "px";
				titleHandle.style.width = "inherit";
				titleHandle.style.position = "absolute";
				titleHandle.style.top = 0 + "px";
				titleHandle.style.left = 0 + "px";
				
				titleHandle.addEventListener("mousedown", this.move, true);
				titleHandle.addEventListener("touchstart", this.moveTouch, true);

				title.appendChild(text);
				title.appendChild(titleHandle);

				return title;
			},

			generateContainer : function() {
				var container = document.createElement("div");

				container.setAttribute("id", "portal-container-" + this.id);
				container.setAttribute("class", "container");

				return container;
			},

			generateFoot : function() {
				var foot = document.createElement("div");

				foot.setAttribute("class", "foot");

				return foot;
			},

			generateHandle : function() {
				var handle = document.createElement("div");

				handle.addEventListener("mousedown", this.resize, true);
				handle.setAttribute("class", "handle");
				handle.setAttribute("id", "portal-handle-" + this.id);
				handle.setAttribute("parent", this.id);

				return handle;
			},

			setTitle : function(title) {
				this.title = title;
			},
			
			setZIndex : function(zIndex) {
				var container = document.getElementById("portal-" + this.id);
				this.zIndex = zIndex;
				container.style.zIndex = zIndex;
			},
			
			updateTitle : function() {
				var title = document.getElementById("portal-title-" + this.id);
				title.innerHTML = this.title;
			},

			move : function(event) {
				var element = event.target.parentNode;
				element = element.parentNode;

				var startX = event.clientX;
				var startY = event.clientY;

				var origX = element.offsetLeft;
				var origY = element.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					element.style.left = (e.clientX - deltaX) + "px";
					if(e.clientY - deltaY > 0) {
						element.style.top = (e.clientY - deltaY) + "px";
					}
					
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			moveTouch : function(event) {
				if(event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];
				}
					
				var element = event.target.parentNode;
				element = element.parentNode;

				var startX = touch.clientX;
				var startY = touch.clientY;

				var origX = element.offsetLeft;
				var origY = element.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					var moveTouch = e.targetTouches[0];
					element.style.left = (moveTouch.clientX - deltaX) + "px";
					element.style.top = (moveTouch.clientY - deltaY) + "px";
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					e.stopPropagation();
				}
			},

			resize : function(event) {
				var element = event.target.parentNode;
				var startX = event.clientX;
				var startY = event.clientY;

				var origX = element.offsetLeft;
				var origY = element.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				var startWidth = element.style.width;
				startWidth = Number(startWidth.substr(0, startWidth.length - 2));
				var startHeight = element.style.height;
				startHeight = Number(startHeight.substr(0, startHeight.length - 2));

				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);

				event.stopPropagation();
				event.preventDefault();

				function moveHandler(e) {
					width = e.clientX - deltaX - origX + startWidth;
					height = e.clientY - deltaY - origY + startHeight;
					if (width > 70) {
						element.style.width = width + "px";
					} else {
						element.style.width = 70 + "px";
					}

					if (height > 70) {
						element.style.height = height + "px";
					} else {
						element.style.height = 70 + "px";
					}

					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			close : function(e) {
				var element = e.target.parentNode;
				var id = element.getAttribute("portalid");
				
				var portals = document.getElementById("desk-cont");
				for(var i = 0; i < portals.childNodes.length; i++) {
					if(portals.childNodes[i].getAttribute("portalid") == id) {
						portals.removeChild(portals.childNodes[i]);
						break;
					}
				}
				
				WT.Desk.applications[id] = null;
				WT.Desk.portals[id] = null;
			}
		};
		return portal;
	}
};