WT.gradient = {
	Application : function(parId) {
		app = {
			parent : parId,
			gradient : new WT.gradient.Gradient(),
			
			init : function() {
				this.gradient.init();
				this.genContainer();
				this.generateColorStops();
			},
			
			genContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);

				
				container.setAttribute("class", "gradient");
				
				container.appendChild(this.genPreview());
				container.appendChild(this.generateGradBar());
				container.appendChild(this.generateActive());
				
				parentElem.appendChild(container);
			},
			
			genPreview : function() {
				var container = document.createElement("div");
				container.setAttribute("class", "preview");
				container.setAttribute("id", "gen-preview");
				container.style.backgroundImage = this.gradient.toString();
				
				return container;
			},
			
			generateGradBar : function() {
				var container = document.createElement("div");
				
				container.setAttribute("id", "select-bar");
				container.setAttribute("class", "select-bar");
				
				return container;
			},
			
			generateColorStops : function() {
				var colorStops = this.gradient.colStops;
				//var width = document.getElementById("portal-container-" + this.parent);
				var container = document.getElementById("select-bar");
				
				//width = width.style.width;
				//width = Number(width.substr(0, width.length - 2));
				
				//console.log("Width: " + width);
				
				for(var i = 0; i < colorStops.length; i++) {
					container.appendChild(this.generateColorStop(colorStops[i]));
				}
			},
			
			generateColorStop : function(colorStop) {
				var container = document.createElement("div");
				var colorBox = document.createElement("div");
				
				container.setAttribute("class", "color-stop");
				
				colorBox.setAttribute("class", "color-box");
				
				container.style.left = colorStop.position + "%";
				container.style.marginLeft = "-5px";
				
				colorBox.style.backgroundColor = "rgb(" + colorStop.color[0] + ", " + colorStop.color[1]
					+ ", " + colorStop.color[2] + ")";
				
				container.appendChild(colorBox);
				
				return container;
			},
			
			generateActive : function() {
				var container = document.createElement("div");
				var color = document.createElement("div");
				var colorForm = document.createElement("div");
				var red = document.createElement("input");
				var blue = document.createElement("input");
				var green = document.createElement("input");
				var posForm = document.createElement("div");
				var pos = document.createElement("input");
				
				container.setAttribute("class", "active-color");
				
				color.setAttribute("class", "color-preview");
				
				colorForm.setAttribute("class", "color-form");
				
				red.setAttribute("class", "color-input");
				red.setAttribute("type", "text");
				blue.setAttribute("class", "color-input");
				blue.setAttribute("type", "text")
				green.setAttribute("class", "color-input");
				green.setAttribute("type", "text");
				
				posForm.setAttribute("class", "pos-form");
				
				pos.setAttribute("class", "pos-input");
				pos.setAttribute("type", "text");
				
				colorForm.appendChild(red);
				colorForm.appendChild(blue);
				colorForm.appendChild(green);
				
				posForm.appendChild(pos);
				
				container.appendChild(color);
				container.appendChild(colorForm);
				container.appendChild(posForm);
				
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
				this.addColor([0, 255, 0], 25, "%");
				this.addColor([255, 0, 0], 70, "%");
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