var WT = {
	orginX : 0,
	orginY : 0,
		
	Desktop : function(srcW, srcH, color) {
		desktop = {
			width : srcW || 640,
			height : srcH || 480,
			background : color || [ 245, 245, 245 ],

			init : function() {
				var container = document.createElement("div");
				container.setAttribute("id", "desk-cont");
				container.setAttribute("class", "desktop");
				container.style.marginTop = "-" + (this.height / 2) + "px";
				container.style.marginLeft = "-" + (this.width / 2) + "px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";

				document.body.appendChild(container);
			},

			initEvent : function() {
				var desk = document.getElementById("desk-cont");
				desk.addEventListener("mousedown", this.mouseButtonDown, false);
				desk.addEventListener("mouseup", this.mouseButtonUp, false);
				desk.addEventListener("mousemove", this.mouseMove, false);
			}
		};
		return desktop;
	},
	
	Portal : function(srcW, srcH, srcP) {
		portal = {
			width : srcW || 320,
			height : srcH || 240,
			parent : srcP || null,
			id : 1,
			title : "Untitled",
			
			init : function() {
				var parentElem, container;
				if(this.parent != null) {
					parentElem = document.getElementById(this.parent);
				} else {
					parentElem = document.body;
				}
				
				container = document.createElement("div");
				container.setAttribute("id", "window-" + this.id);
				container.setAttribute("class", "portal");
				container.style.top = "100px";
				container.style.left = "10px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";
				
				container.appendChild(this.generateTitle());
				container.appendChild(this.generateContainer());
				container.appendChild(this.generateFoot());
				container.appendChild(this.generateHandle());
				
				parentElem.appendChild(container);
			},
		
			generateTitle : function() {
				var title = document.createElement("div");
				
				var text = document.createElement("div");
				var close = document.createElement("div");
				var max = document.createElement("div");
				var min = document.createElement("div");
				
				title.setAttribute("id", "title-" + this.id);
				title.setAttribute("onmousedown", "WT.event.move(this.parentNode, event)");
				title.setAttribute("class", "title");
				
				text.innerHTML = this.title;
				text.style.position = "absolute";
				text.style.left = 4 + "px";
				text.style.top = 2 + "px";
				//text.style.fontWeight = "bold";
				text.style.fontSize = 12 + "px";
				text.style.color = "#000";

				close.style.width = 13 + "px";
				close.style.height = 13 + "px";
				close.style.position = "absolute";
				close.style.right = 2 + "px";
				close.style.top = 2 + "px";
				close.style.borderStyle = "solid";
				close.style.borderWidth = "1px";
				close.style.borderColor = "#a00";
				close.style.borderRadius = "3px";
				close.style.backgroundColor = "#d00";
				
				
				title.appendChild(text);
				title.appendChild(close);
				
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
				
				handle.setAttribute("onmousedown", "WT.event.resize(this.parentNode, event)");
				handle.setAttribute("class", "handle");
				
				return handle;
			},
			
			initEventHandler : function() {
				var title = document.getElementById("title-" + this.id);
				title.addEventListener("mousemove", this.move, false);
			},
			
			setTitle : function(title) {
				this.title = title;
			}
		};
		return portal;
	}
};