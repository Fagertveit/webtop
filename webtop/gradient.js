WT.gradient = {
	Application : function(parId) {
		app = {
			parent : parId,
			activeColor : 0,
			gradient : new WT.gradient.Gradient(),
			
			init : function() {
				this.gradient.init();
				this.gradient.sortColor();
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
				this.gradient.sortColor();
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
					container.appendChild(this.generateColorStop(colorStops[i], colorStops[i].id));
				}
			},
			
			generateColorStop : function(colorStop, id) {
				var container = document.createElement("div");
				var colorBox = document.createElement("div");
				
				container.setAttribute("class", "color-stop");
				container.setAttribute("color-id", id);
				//container.setAttribute("onclick", "WT.gradient.event.select(" + this + ")");
				//container.setAttribute("onmousedown", this.moveColorStop, true);
				container.addEventListener("mousedown", this.moveColorStop, true);
				container.addEventListener("click", this.selectColorStop, true);
				
				colorBox.setAttribute("class", "color-box");
				colorBox.setAttribute("color-id", id);
				
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
				
				var redEntry = document.createElement("div");
				var redLabel = document.createElement("div");
				var red = document.createElement("input");
				
				var blueEntry = document.createElement("div");
				var blueLabel = document.createElement("div");
				var blue = document.createElement("input");
				
				var greenEntry = document.createElement("div");
				var greenLabel = document.createElement("div");
				var green = document.createElement("input");
				
				var posForm = document.createElement("div");
				
				var posEntry = document.createElement("div");
				var posLabel = document.createElement("div");
				var pos = document.createElement("input");
				var active = this.gradient.getColorById(this.activeColor);
				
				var del = document.createElement("div");
				var add = document.createElement("div");
				
				del.setAttribute("class", "btn color-del");
				del.innerHTML = "Delete";
				del.addEventListener("click", this.removeColor, true);
				
				add.setAttribute("class", "btn color-add");
				add.innerHTML = "Add";
				add.addEventListener("click", this.addColor, true);
				
				container.setAttribute("class", "active-color");
				
				color.setAttribute("class", "color-preview");
				color.setAttribute("id", "color-preview");
				color.style.backgroundColor = active.toCSS();
				
				colorForm.setAttribute("class", "color-form");
				
				redEntry.setAttribute("class", "color-entry");
				redLabel.setAttribute("class", "label");
				redLabel.innerHTML = "Red";
				red.setAttribute("class", "input");
				red.setAttribute("id", "gradient-red");
				red.setAttribute("type", "text");
				red.setAttribute("value", active.color[0]);
				red.addEventListener("change", this.changeRed, true);
				
				blueEntry.setAttribute("class", "color-entry");
				blueLabel.setAttribute("class", "label");
				blueLabel.innerHTML = "Green";
				blue.setAttribute("class", "input");
				blue.setAttribute("id", "gradient-blue");
				blue.setAttribute("type", "text");
				blue.setAttribute("value", active.color[1]);
				blue.addEventListener("change", this.changeBlue, true);
				
				greenEntry.setAttribute("class", "color-entry");
				greenLabel.setAttribute("class", "label");
				greenLabel.innerHTML = "Blue";
				green.setAttribute("class", "input");
				green.setAttribute("id", "gradient-green");
				green.setAttribute("type", "text");
				green.setAttribute("value", active.color[2]);
				green.addEventListener("change", this.changeGreen, true);
				
				posForm.setAttribute("class", "pos-form");
				
				posEntry.setAttribute("class", "pos-entry");
				posLabel.setAttribute("class", "label");
				posLabel.innerHTML = "Position %";
				pos.setAttribute("class", "input");
				pos.setAttribute("id", "gradient-pos");
				pos.setAttribute("type", "text");
				pos.setAttribute("value", active.position);
				pos.addEventListener("change", this.changePos, true);
				
				redEntry.appendChild(redLabel);
				redEntry.appendChild(red);
				colorForm.appendChild(redEntry);
				
				blueEntry.appendChild(blueLabel);
				blueEntry.appendChild(blue);
				colorForm.appendChild(blueEntry);
				
				greenEntry.appendChild(greenLabel);
				greenEntry.appendChild(green);
				colorForm.appendChild(greenEntry);
				
				posEntry.appendChild(posLabel);
				posEntry.appendChild(pos);
				posForm.appendChild(posEntry);
				
				container.appendChild(color);
				container.appendChild(colorForm);
				container.appendChild(posForm);
				
				container.appendChild(add);
				container.appendChild(del);
				
				return container;
			},
			
			updatePreview : function() {
				var container = document.getElementById("gen-preview");
				container.style.backgroundImage = this.gradient.toString();
			},
			
			updateGradient : function() {
				var select = document.getElementById("select-bar");
				select.innerHTML = "";
				
				this.gradient.sortColor();
				this.updatePreview();
				this.generateColorStops();
			},
			
			setActiveColor : function(id) {
				this.activeColor = id;
				var color = document.getElementById("color-preview");
				var red = document.getElementById("gradient-red");
				var blue = document.getElementById("gradient-blue");
				var green = document.getElementById("gradient-green");
				var pos = document.getElementById("gradient-pos");
				var active = this.gradient.getColorById(this.activeColor);
				
				color.style.backgroundColor = active.toCSS();
				
				red.value = active.color[0];
				blue.value = active.color[1];
				green.value = active.color[2];
				pos.value = active.position;
			},
			
			selectColorStop : function(e) {
				var id = e.srcElement.getAttribute("color-id");
				app.setActiveColor(id);
			},
			
			moveColorStop : function(e) {
				elem = e.srcElement;
				
				if(e.srcElement.getAttribute("class") == "color-box") {
					elem = e.srcElement.parentNode;
				}
				
				app.setActiveColor(elem.getAttribute("color-id"));
				
				bar = document.getElementById("select-bar");
				var barWidth = bar.clientWidth;
				var startX = e.clientX;
				var deltaX = startX - elem.offsetLeft;
				
				//console.log("Bar Width: " + barWidth + " Bar Start: " + deltaX);
				
				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					var pos;
					
					if(e.clientX > deltaX + barWidth) {
						pos = 100;
					} else if(e.clientX < deltaX) {
						pos = 0;
					} else {
						pos = e.clientX - deltaX + 8;
						pos /= barWidth;
						pos *= 100;
						pos = Math.floor(pos);
					}
					
					if(pos > 100) {
						pos = 100;
					}
					
					if(pos < 0) {
						pos = 0;
					}
					elem.style.left = pos + "%";
					
					var active = app.gradient.getColorById(app.activeColor);
					active.position = pos;
					app.gradient.setColorById(app.activeColor);
					app.updateGradient();
					
					var inputPos = document.getElementById("gradient-pos");
					inputPos.value = pos;
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					
					app.updateGradient();
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			removeColor : function(e) {
				app.activeColor = app.gradient.removeOldColor(app.activeColor);
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			},
			
			addColor : function(e) {
				app.activeColor = app.gradient.addNewColor(app.activeColor);
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			},
			
			changeRed : function(e) {
				var value = e.srcElement.value;
				var active = app.gradient.getColorById(app.activeColor);
				active.color[0] = value;
				app.gradient.setColorById(app.activeColor);
				
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			},
			
			changeBlue : function(e) {
				var value = e.srcElement.value;
				var active = app.gradient.getColorById(app.activeColor);
				active.color[1] = value;
				app.gradient.setColorById(app.activeColor);
				
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			},
			
			changeGreen : function(e) {
				var value = e.srcElement.value;
				var active = app.gradient.getColorById(app.activeColor);
				active.color[2] = value;
				app.gradient.setColorById(app.activeColor);
				
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			},
			
			changePos : function(e) {
				var value = e.srcElement.value;
				var active = app.gradient.getColorById(app.activeColor);
				active.position = value;
				app.gradient.setColorById(app.activeColor);
				
				app.setActiveColor(app.activeColor);
				app.updateGradient();
			}
		};
		return app;
	},
		
	Gradient : function() {
		gradient = {
			colStops : new Array(),
			start : "left",
			nextId : 0,
			
			init : function() {
				this.addColor([255, 255, 255], 0, "%");
				this.addColor([255, 255, 0], 40, "%");
				this.addColor([0, 0, 255], 25, "%");
				this.addColor([255, 0, 255], 70, "%");
				this.addColor([255, 0, 0], 50, "%");
				this.addColor([0, 0, 0], 100, "%");
			},
			
			addColor : function(colors, pos, type) {
				var temp = new WT.gradient.ColorStop(colors, pos, type, this.nextId);
				this.nextId++;
				this.colStops.push(temp);
			},
			
			addNewColor : function(id) {
				var activeColor;
				var nextColor;
				var red;
				var blue;
				var green;
				var pos;
				
				for(var i = 0; i < this.colStops.length; i++) {
					if(this.colStops[i].id == id) {
						activeColor = this.colStops[i];
						if(this.colStops.length > i+1) {
							nextColor = this.colStops[i + 1];
						} else {
							nextColor = this.colStops[i - 1];
						}
					}
				}
				
				if(activeColor.color[0] > nextColor.color[0]) {
					var temp = activeColor.color[0] - nextColor.color[0];
					red = Math.floor(nextColor.color[0] + (temp/2));
				} else {
					var temp = nextColor.color[0] - activeColor.color[0];
					red = Math.floor(activeColor.color[0] + (temp/2));
				}
				
				if(activeColor.color[1] > nextColor.color[1]) {
					var temp = activeColor.color[1] - nextColor.color[1];
					blue = Math.floor(nextColor.color[1] + (temp/2));
				} else {
					var temp = nextColor.color[1] - activeColor.color[1];
					blue = Math.floor(activeColor.color[1] + (temp/2));
				}
				
				if(activeColor.color[2] > nextColor.color[2]) {
					var temp = activeColor.color[0] - nextColor.color[2];
					green = Math.floor(nextColor.color[2] + (temp/2));
				} else {
					var temp = nextColor.color[2] - activeColor.color[2];
					green = Math.floor(activeColor.color[2] + (temp/2));
				}
				
				if(activeColor.position > nextColor.position) {
					var temp = activeColor.position - nextColor.position;
					pos = Math.floor(nextColor.position + (temp/2));
				} else {
					var temp = nextColor.position - activeColor.position;
					pos = Math.floor(activeColor.position + (temp/2));
				}
				
				var temp = new WT.gradient.ColorStop([red, blue, green], pos, "%", this.nextId);
				this.nextId++;
				this.colStops.push(temp);
				
				return temp.id;
			},
			
			getColorById : function(id) {
				for(var i = 0; i < this.colStops.length; i++) {
					if(this.colStops[i].id == id) {
						return this.colStops[i];
					}
				}
			},
			
			setColorById : function(color, id) {
				for(var i = 0; i < this.colStops.length; i++) {
					if(this.colStops[i].id == id) {
						this.colStops[i] == color;
						break;
					}
				}
			},
			
			removeColor : function(id) {
				for(var i = 0; i < this.colStops.length; i++) {
					if(this.colStops[i].id == id) {
						this.colStops.splice(i, 1);
						break;
					}
				}
			},
			
			removeOldColor : function(id) {
				if(this.colStops.length == 2) {
					return id;
				} else {
					for(var i = 0; i < this.colStops.length; i++) {
						if(this.colStops[i].id == id) {
							this.colStops.splice(i, 1);
							if(this.colStops.length > i) {
								return this.colStops[i].id;
							} else {
								return this.colStops[i-1].id;
							}
						}
					}
				}
			},
			
			sortColor : function(activeColor) {
				var tempArray = new Array();
				var sortArray = this.colStops;
				var smallest;
				
				//console.log("Init Array: " + sortArray.length);
				
				while(sortArray.length != 0) {
					smallest = this.findLowest(sortArray);
					
					tempArray.push(smallest[0]);
					sortArray.splice(smallest[1], 1);
					
					//console.log("Sort Array Size: " + sortArray.length);
				}
				
				this.colStops = tempArray;
			},
			
			findLowest : function(stops) {
				var smallest = new Array();
				smallest[0] = stops[0];
				smallest[1] = 0;
				
				for(var i = 1; i < stops.length; i++) {
					if(smallest[0].position > stops[i].position) {
						smallest[0] = stops[i];
						smallest[1] = i;
					}
				}
				return smallest;
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

	ColorStop : function(col, pos, posT, i) {
		cs = {
			position : pos || 0,
			color : col || [255, 255, 255],
			posType : posT || "%",
			id : i || 0,
			
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
			},
			
			toCSS : function() {
				return "rgb(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2]
				+ ")";
			}
		};
		return cs;
	}
};