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
				container.style.position = "absolute";
				container.style.top = "50%";
				container.style.left = "50%";
				container.style.marginTop = "-" + (this.height / 2) + "px";
				container.style.marginLeft = "-" + (this.width / 2) + "px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";
				container.style.borderWidth = "1px";
				container.style.borderStyle = "solid";
				container.style.borderColor = "#000";
				container.style.backgroundColor = "rgb(" + this.background[0]
						+ ", " + this.background[1] + ", " + this.background[2]
						+ ")";

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
			
			init : function() {
				var parentElem, container;
				if(this.parent != null) {
					parentElem = document.getElementById(this.parent);
				} else {
					parentElem = document.body;
				}
				
				container = document.createElement("div");
				container.setAttribute("id", "window-" + this.id);
				container.style.position = "absolute";
				container.style.top = "100px";
				container.style.left = "10px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";
				container.style.borderTopLeftRadius = "3px";
				container.style.borderTopRightRadius = "3px";
				container.style.borderStyle = "solid";
				container.style.borderWidth = "1px";
				container.style.borderColor = "#000";
				container.style.backgroundColor = "#fff";
				
				container.appendChild(this.generateTitle());
				
				parentElem.appendChild(container);
			},
		
			generateTitle : function() {
				var title = document.createElement("div");
				title.setAttribute("id", "title-" + this.id);
				title.style.width = this.width + "px";
				title.style.height = "18px";
				title.style.backgroundColor = "#aaf";
				title.style.borderBottomStyle = "solid";
				title.style.borderBottomWidth = "1px";
				title.style.borderBottomColor = "#000";
				
				return title;
			},
			
			initEventHandler : function() {
				var title = document.getElementById("title-" + this.id);
				title.addEventListener("mousemove", this.move, false);
			},
			
			move : function() {
				
			}
		};
		return portal;
	}
};