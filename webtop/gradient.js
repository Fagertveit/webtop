/* WebTop Gradient
 * ---------------
 * Gradient is a collection of classes that together makes a general purpose gradient tool
 * package for Webtop, it will contain both modules and an Application that will be used
 * within WebTop.
 * Right now the package contains:
 * Application
 * 	A application where the user can edit and export gradients. At start the export function will
 * 	only work for Linear gradients in CSS, I will try to expand this to work in different
 *  gradient types and applications such as Adobe Photoshop and Inkscape!
 *  
 * Gradient
 *  The container for a gradient object, this object holds an array of colorstops.
 *  
 * ColorStop
 *  A object that holds color and position data.
 * 
 */
WT.gradient = {
	Application : function(parId) {
		var app = {
			parent : parId,
			activeColor : 0,
			color : new WT.color.Color(255, 255, 255),
			hue : 0.0,
			gradient : new WT.gradient.Gradient(),
			width : 256,
			height : 242,
			title : "Gradient Edit 0.2",
			
			init : function() {
				this.gradient.init();
				this.gradient.sortColor();
				this.genContainer();
				this.generateColorStops();
			},
			
			genContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);
				var tempColor = this.gradient.colStops[this.activeColor].color;
				this.color.setRGB(tempColor[0], tempColor[1], tempColor[2]);
				this.color.RGBtoHSL();

				container.setAttribute("class", "gradient");
				
				container.appendChild(this.genPreview());
				container.appendChild(this.generateGradBar());
				container.appendChild(this.generateActive());
				
				parentElem.appendChild(container);
			},
			
			genPreview : function() {
				var container = document.createElement("div");
				container.setAttribute("class", "preview");
				container.setAttribute("id", "gen-preview-" + this.parent);
				this.gradient.sortColor();
				var gradient = this.gradient.toString();
				
				container.setAttribute("style",
						"background-image: -webkit-" + gradient + ";" +
						"background-image: -moz-" + gradient + ";" +
						"background-image: -ms-" + gradient + ";" +
						"background-image: -o-" + gradient + ";" +
						"background-image: " + gradient + ";");
				
				return container;
			},
			
			generateGradBar : function() {
				var container = document.createElement("div");
				
				container.setAttribute("id", "select-bar-" + this.parent);
				container.setAttribute("class", "select-bar");
				
				return container;
			},
			
			generateColorStops : function() {
				var colorStops = this.gradient.colStops;
				//var width = document.getElementById("portal-container-" + this.parent);
				var container = document.getElementById("select-bar-" + this.parent);
				
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
				container.setAttribute("parent", this.parent);
				container.setAttribute("id", "color-stop-" + this.parent + "-" + id);
				//container.setAttribute("onclick", "WT.gradient.event.select(" + this + ")");
				//container.setAttribute("onmousedown", this.moveColorStop, true);
				container.addEventListener("mousedown", this.moveColorStop, true);
				container.addEventListener("click", this.selectColorStop, true);
				
				if(id == this.activeColor) {
					container.style.backgroundImage = "url(img/arrow-color-stop-active.png)";
				} else {
					container.style.backgroundImage = "url(img/arrow-color-stop.png)";
				}
				
				colorBox.setAttribute("class", "color-box");
				colorBox.setAttribute("color-id", id);
				
				container.style.left = colorStop.position + "%";
				container.style.marginLeft = "-5px";
				
				colorBox.style.backgroundColor = colorStop.toCSS();
				
				container.appendChild(colorBox);
				
				return container;
			},
			
			generateActive : function() {
				var active = this.gradient.getColorById(this.activeColor);
				
				var container = document.createElement("div");
				container.setAttribute("class", "active-color");
				
				var colorMap = document.createElement("div");
				colorMap.setAttribute("class", "color-map");
				colorMap.setAttribute("id", "color-map-" + this.parent);
				colorMap.setAttribute("parent", this.parent);
				colorMap.style.backgroundColor = active.toCSS();
				
				var lightMap = document.createElement("div");
				lightMap.setAttribute("class", "light-map");
				
				var saturationMap = document.createElement("div");
				saturationMap.setAttribute("class", "sat-map");
				
				var hueBar = document.createElement("div");
				hueBar.setAttribute("class", "hue-bar");
				hueBar.setAttribute("parent", this.parent);
				
				var hueIndicator = document.createElement("div");
				hueIndicator.setAttribute("class", "hue-ind");
				hueIndicator.setAttribute("parent", this.parent);
				hueIndicator.setAttribute("id", "hue-ind-" + this.parent);
				hueIndicator.addEventListener("mousedown", this.moveHue, true);
				
				var colorIndicator = document.createElement("div");
				colorIndicator.setAttribute("class", "color-ind");
				colorIndicator.setAttribute("parent", this.parent);
				colorIndicator.setAttribute("id", "color-ind-" + this.parent);
				colorIndicator.addEventListener("mousedown", this.moveSL, true);
				
				var color = document.createElement("div");
				color.setAttribute("class", "color-preview");
				color.setAttribute("id", "color-preview-" + this.parent);
				color.style.backgroundColor = active.toCSS();
				
				var add = document.createElement("div");
				add.setAttribute("class", "btn color-add");
				add.setAttribute("parent", this.parent);
				add.innerHTML = "Add";
				add.addEventListener("click", this.addColor, true);
				
				var del = document.createElement("div");
				del.setAttribute("class", "btn color-del");
				del.setAttribute("parent", this.parent);
				del.innerHTML = "Remove";
				del.addEventListener("click", this.removeColor, true);
				
				var exp = document.createElement("div");
				exp.setAttribute("class", "btn color-export");
				exp.setAttribute("parent", this.parent);
				exp.innerHTML = "Export";
				
				colorMap.appendChild(lightMap);
				colorMap.appendChild(saturationMap);
				colorMap.appendChild(colorIndicator);
				
				hueBar.appendChild(hueIndicator);
				
				container.appendChild(colorMap);
				container.appendChild(hueBar);
				container.appendChild(color);
				
				container.appendChild(add);
				container.appendChild(del);
				container.appendChild(exp);
				
				return container;
				/*
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
				del.setAttribute("parent", this.parent);
				del.innerHTML = "Delete";
				del.addEventListener("click", this.removeColor, true);
				
				add.setAttribute("class", "btn color-add");
				add.setAttribute("parent", this.parent);
				add.innerHTML = "Add";
				add.addEventListener("click", this.addColor, true);
				
				container.setAttribute("class", "active-color");
				
				color.setAttribute("class", "color-preview");
				color.setAttribute("id", "color-preview-" + this.parent);
				color.style.backgroundColor = active.toCSS();
				
				colorForm.setAttribute("class", "color-form");
				
				redEntry.setAttribute("class", "color-entry");
				redLabel.setAttribute("class", "label");
				redLabel.innerHTML = "Red";
				red.setAttribute("class", "input");
				red.setAttribute("id", "gradient-red-" + this.parent);
				red.setAttribute("type", "text");
				red.setAttribute("value", active.color[0]);
				red.setAttribute("parent", this.parent);
				red.addEventListener("change", this.changeRed, true);
				
				blueEntry.setAttribute("class", "color-entry");
				blueLabel.setAttribute("class", "label");
				blueLabel.innerHTML = "Green";
				blue.setAttribute("class", "input");
				blue.setAttribute("id", "gradient-blue-" + this.parent);
				blue.setAttribute("type", "text");
				blue.setAttribute("value", active.color[1]);
				blue.setAttribute("parent", this.parent);
				blue.addEventListener("change", this.changeBlue, true);
				
				greenEntry.setAttribute("class", "color-entry");
				greenLabel.setAttribute("class", "label");
				greenLabel.innerHTML = "Blue";
				green.setAttribute("class", "input");
				green.setAttribute("id", "gradient-green-" + this.parent);
				green.setAttribute("type", "text");
				green.setAttribute("value", active.color[2]);
				green.setAttribute("parent", this.parent);
				green.addEventListener("change", this.changeGreen, true);
				
				posForm.setAttribute("class", "pos-form");
				
				posEntry.setAttribute("class", "pos-entry");
				posLabel.setAttribute("class", "label");
				posLabel.innerHTML = "Position %";
				pos.setAttribute("class", "input");
				pos.setAttribute("id", "gradient-pos-" + this.parent);
				pos.setAttribute("type", "text");
				pos.setAttribute("value", active.position);
				pos.setAttribute("parent", this.parent);
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
				*/
				
			},
			
			updatePreview : function() {
				var container = document.getElementById("gen-preview-" + this.parent);
				var gradient = this.gradient.toString();
				//container.style.backgroundImage = this.gradient.toString();
				container.setAttribute("style",
								"background-image: -webkit-" + gradient + ";" +
								"background-image: -moz-" + gradient + ";" +
								"background-image: -ms-" + gradient + ";" +
								"background-image: -o-" + gradient + ";" +
								"background-image: " + gradient + ";");
			},
			
			updateGradient : function() {
				var select = document.getElementById("select-bar-" + this.parent);
				select.innerHTML = "";
				
				this.gradient.sortColor();
				this.updatePreview();
				this.generateColorStops();
			},
			
			setActiveColor : function(id) {
				this.activeColor = id;
				var color = document.getElementById("color-preview-" + this.parent);
				var colorMap = document.getElementById("color-map-" + this.parent);
				var hueIndicator = document.getElementById("hue-ind-" + this.parent);
				var colorIndicator = document.getElementById("color-ind-" + this.parent);
				var x;
				var y;
				//var red = document.getElementById("gradient-red-" + this.parent);
				//var blue = document.getElementById("gradient-blue-" + this.parent);
				//var green = document.getElementById("gradient-green-" + this.parent);
				//var pos = document.getElementById("gradient-pos-" + this.parent);
				var active = this.gradient.getColorById(this.activeColor);
				var tempColor = this.color;
				
				tempColor.setHSL(tempColor.h, 1.0, 0.5);
				tempColor.HSLtoRGB();
				
				color.style.backgroundColor = active.toCSS();
				colorMap.style.backgroundColor = tempColor.toCSS();
				
				x = Math.floor(tempColor.s * 128);
				y = Math.floor(Math.abs(tempColor.l - 1) * 128);
				
				colorIndicator.style.top = y + "px";
				colorIndicator.style.left = x + "px";
				
				y = Math.floor(Math.abs(tempColor.h - 1) * 128);
				
				hueIndicator.style.top = y + "px";
				
				//red.value = active.color[0];
				//blue.value = active.color[1];
				//green.value = active.color[2];
				//pos.value = active.position;
			},
			
			testColorRGB : function(r, g, b) {
				var color = document.getElementById("color-preview-" + this.parent);
				var colorMap = document.getElementById("color-map-" + this.parent);
				var active = this.gradient.getColorById(this.activeColor);
				var tempColor = this.color;
				tempColor.setRGB(r, g, b);
				//tempColor.setHSL(1.0, 1.0, 0.5);
				//tempColor.HSLtoRGB();
				
				color.style.backgroundColor = tempColor.toCSS();
				colorMap.style.backgroundColor = tempColor.toCSS();
			},
			
			testColorHSL : function(h, s, l) {
				var color = document.getElementById("color-preview-" + this.parent);
				var colorMap = document.getElementById("color-map-" + this.parent);
				var active = this.gradient.getColorById(this.activeColor);
				var tempColor = this.color;
				
				tempColor.setHSL(h, s, l);
				tempColor.HSLtoRGB();
				
				color.style.backgroundColor = tempColor.toCSS();
				colorMap.style.backgroundColor = tempColor.toCSS();
			},
			
			selectColorStop : function(e) {
				var id = e.target.getAttribute("color-id");
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].setActiveColor(id);
			},
			
			moveColorStop : function(e) {
				var elem = e.target;
				
				if(e.target.getAttribute("class") == "color-box") {
					elem = e.target.parentNode;
				}
				var parent = elem.getAttribute("parent");
				
				WT.Desk.applications[parent].setActiveColor(elem.getAttribute("color-id"));
				
				var bar = document.getElementById("select-bar-" + parent);
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
					
					var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
					active.position = pos;
					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].updateGradient();
					
					//var inputPos = document.getElementById("gradient-pos-" + parent);
					//inputPos.value = pos;
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					
					WT.Desk.applications[parent].updateGradient();
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			moveSL : function(e) {
				var colorMap = e.target.parentNode;
				var parent = colorMap.getAttribute("parent");
				var indicator = document.getElementById("color-ind-" + parent);
				var sat;
				var light;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				var color = new WT.color.Color(active.color[0], active.color[1], active.color[2]);
				var x, y, xy;
				
				color.RGBtoHSL();
				console.log(color.toString());
				
				var startX = e.clientX;
				var startY = e.clientY;
				
				var deltaX = startX - indicator.offsetLeft;
				var deltaY = startY - indicator.offsetTop;
				
				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					
					
					if(e.clientY > deltaY + 128) {
						y = 0.0;
						indicator.style.top = 123 + "px";
					} else if(e.clientY < deltaY) {
						y = 1.0;
						indicator.style.top = -5 + "px";
					} else {
						y = (e.clientY - deltaY) / 128;
						y -= 1;
						y = Math.abs(y);
						indicator.style.top = e.clientY - deltaY + "px";
					}
					
					if(e.clientX > deltaX + 128) {
						x = 1.0
						indicator.style.left = 123 + "px";
					} else if(e.clientX < deltaX) {
						x = 0.0;
						indicator.style.left = -5 + "px";
					} else {
						x = (e.clientX - deltaX) / 128;
						indicator.style.left = e.clientX - deltaX + "px";
					}
					
					sat = x;
					color.setSaturation(sat);
					
					light = y / 2;
					if(y/2 - x/2 > 0) {
						light += y/2 - x/2;
					}
					
					color.setLight(light);
					
					color.HSLtoRGB();
					
					active.color[0] = color.r;
					active.color[1] = color.g;
					active.color[2] = color.b;
					
					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].updateGradient();
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			moveHue : function(e) {
				var hueBar = e.target.parentNode;
				var indicator = e.target;
				var hue;
				var parent = hueBar.getAttribute("parent");
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				var color = WT.Desk.applications[parent].color;
				color.setRGB(active.color[0], active.color[1], active.color[2]);
				
				
				var startY = e.clientY;
				var deltaY = startY - indicator.offsetTop - 5;
				
				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					
					if(e.clientY > deltaY + 128) {
						hue = 0.0;
						indicator.style.top = 123 + "px";
					} else if(e.clientY < deltaY) {
						hue = 1.0;
						indicator.style.top = -5 + "px";
					} else {
						hue = (e.clientY - deltaY) / 128;
						hue -= 1;
						hue = Math.abs(hue);
						indicator.style.top = e.clientY - deltaY + "px";
					}
					color.setHue(hue);
					
					active.color[0] = color.r;
					active.color[1] = color.g;
					active.color[2] = color.b;

					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].updateGradient();
					
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			removeColor : function(e) {
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].activeColor = WT.Desk.applications[parent].gradient.removeOldColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			addColor : function(e) {
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].activeColor = WT.Desk.applications[parent].gradient.addNewColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			changeRed : function(e) {
				var parent = e.target.getAttribute("parent");
				var value = e.target.value;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				active.color[0] = value;
				WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
				
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			changeBlue : function(e) {
				var parent = e.target.getAttribute("parent");
				var value = e.target.value;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				active.color[1] = value;
				WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
				
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			changeGreen : function(e) {
				var parent = e.target.getAttribute("parent");
				var value = e.target.value;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				active.color[2] = value;
				WT.Desk.applications[parent].gradient.setColorById(app.activeColor);
				
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			changePos : function(e) {
				var parent = e.target.getAttribute("parent");
				var value = e.target.value;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				active.position = value;
				WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
				
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			}
		};
		return app;
	},
		
	Gradient : function() {
		var gradient = {
			colStops : new Array(),
			start : "left",
			nextId : 0,
			
			init : function() {
				this.addColor([255, 255, 0], 0, "%");
				this.addColor([0, 0, 255], 40, "%");
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
				str = "linear-gradient("
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
		var cs = {
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