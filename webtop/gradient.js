WT.gradient = {
	Application : function(parId) {
		app = {
			width : 256,
			height : 256,
			parent : parId,
			gradient : new WT.gradient.Gradient(),
			
			init : function() {
				this.gradient.init();
				this.genContainer();
			},
			
			genContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);
				
				//container.style.width = this.width + "px";
				//container.style.height = this.height + "px";
				container.style.width = "100%";
				container.style.position = "absolute";
				container.style.top = "2px";
				container.style.left = "0px";
				
				container.appendChild(this.genPreview());
				
				parentElem.appendChild(container);
			},
			
			genPreview : function() {
				var container = document.createElement("div");
				container.setAttribute("class", "gen-preview");
				container.setAttribute("id", "gen-preview");
				container.style.height = "32px";
				container.style.position = "absolute";
				container.style.left = "2px";
				container.style.right = "2px";
				container.style.top = "6px";
				container.style.borderColor = "#000";
				container.style.borderStyle = "solid";
				container.style.borderWidth = "1px";
				container.style.position = "absolute";
				container.style.top = "2px";
				container.style.left = "2px";
				container.style.backgroundImage = this.gradient.toString();
				
				return container;
			},
			
			updatePreview : function() {
				var container = document.getElementById("gen-preview");
				container.style.backgroundImage = this.gradient.toString();
			}
		};
		return app;
	},
		
	Gradient : function() {
		gradient = {
			colStops : new Array(),
			start : "left",
			
			init : function() {
				this.addColor([255, 255, 255], 0, "%");
				this.addColor([0, 0, 0], 100, "%");
			},
			
			addColor : function(colors, pos, type) {
				var temp = new WT.gradient.ColorStop(colors, pos, type);
				this.colStops.push(temp);
			},
			
			removeColor : function(pos) {
				this.colStops.remove(pos);
			},
			
			toString : function() {
				var str;
				str = "-webkit-linear-gradient("
					+ this.start;
				for(var i = 0; i < this.colStops.length; i++) {
					str += ", " + this.colStops[i].toString();
				}
				str += ")";
				
				return str;
			}
		};
		return gradient;
	},

	ColorStop : function(col, pos, posT) {
		cs = {
			color : col || [255, 255, 255],
			position : pos || 0,
			posType : posT || "%",
			
			setColors : function(colors) {
				this.color[0] = colors[0];
				this.color[1] = colors[1];
				this.color[2] = colors[2];
			},
			
			setPosition : function(value, type) {
				this.position = value;
				this.posType = type;
			},
			
			toString : function() {
				return "rgb(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2]
						+ ") " + this.position + this.posType;
			}
		};
		return cs;
	}
};