WT.portal = {
	Portal : function(srcW, srcH, srcP, srcId) {
		portal = {
			width : srcW || 320,
			height : srcH || 240,
			parent : srcP || null,
			id : srcId,
			title : "Untitled",

			init : function() {
				var parentElem, container;
				if (this.parent != null) {
					parentElem = document.getElementById(this.parent);
				} else {
					parentElem = document.body;
				}
				
				var close = document.createElement("div");
				var max = document.createElement("div");
				var min = document.createElement("div");

				container = document.createElement("div");
				container.setAttribute("id", "portal-" + this.id);
				container.setAttribute("class", "portal");
				container.setAttribute("portalid", this.id)
				container.style.top = "100px";
				container.style.left = "10px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";
				
				close.setAttribute("class", "close");
				close.addEventListener("click", this.close, true);
				min.setAttribute("class", "min");
				max.setAttribute("class", "max");

				container.appendChild(this.generateTitle());
				container.appendChild(this.generateContainer());
				container.appendChild(this.generateFoot());
				container.appendChild(this.generateHandle());
				
				container.appendChild(close);
				container.appendChild(min);
				container.appendChild(max);

				parentElem.appendChild(container);

				this.id = WT.nextId;
				WT.nextId++;
			},

			generateTitle : function() {
				var title = document.createElement("div");

				var text = document.createElement("div");
				

				title.setAttribute("id", "portal-titlebar-" + this.id);
				title.setAttribute("class", "title");

				title.addEventListener("mousedown", this.move, true);

				text.setAttribute("id", "portal-title-" + this.id);
				text.innerHTML = this.title;
				text.style.position = "absolute";
				text.style.left = 4 + "px";
				text.style.top = 2 + "px";
				text.style.fontSize = 12 + "px";
				text.style.color = "#000";

				

				title.appendChild(text);
				

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

				return handle;
			},

			setTitle : function(title) {
				this.title = title;
			},
			
			updateTitle : function() {
				var title = document.getElementById("portal-title-" + this.id);
				title.innerHTML = this.title;
			},

			move : function(event) {
				var element = event.srcElement.parentNode;

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
					element.style.top = (e.clientY - deltaY) + "px";
					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},

			resize : function(event) {
				var element = event.srcElement.parentNode;
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
				var element = e.srcElement.parentNode;
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