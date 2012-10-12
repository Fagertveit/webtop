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
 * ToDo's
 *  I need to fix syncronization problems with the hue and saturation controllers so that they are
 *  placed right when I switch colorstops and such.
 *  Maybe write a function that is dedicated to placing these elements.
 *  
 *  Extended controls and options to make the application a bit more interesting.
 */
WT.gradient = {
	Application : function(parId) {
		var app = {
			parent : parId,
			activeColor : 0,
			color : new WT.color.Color(255, 0, 0),
			hue : 0.0,
			gradient : new WT.gradient.Gradient(),
			portalSettings : { width : 256, height : 208, fixed : true, footer : false, title : "Gradient Edit 0.3"},
			iconSettings : { img : "img/wt-icon-gradient.png", app : WT.gradient.Application, title : "Gradient Edit" },
			
			/*
			 * Init the application
			 */
			init : function() {
				this.gradient.init();
				this.gradient.sortColor();
				this.genContainer();
				this.generateColorStops();
			},
			
			/*
			 * Generate container elements, start generate application elements.
			 */
			genContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);
				var tempColor = this.gradient.colStops[this.activeColor].color;
				this.color.setRGB(tempColor.r, tempColor.g, tempColor.b);
				this.color.RGBtoHSL();

				container.setAttribute("class", "gradient");
				
				container.appendChild(this.genPreview());
				container.appendChild(this.generateGradBar());
				container.appendChild(this.generateActive());
				
				parentElem.appendChild(container);
			},
			
			/*
			 * Generate gradient Preview
			 */
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
			
			/*
			 * Generate gradient stops container.
			 */
			generateGradBar : function() {
				var container = document.createElement("div");
				
				container.setAttribute("id", "select-bar-" + this.parent);
				container.setAttribute("class", "select-bar");
				
				return container;
			},
			
			/*
			 * Generate gradient color stops!
			 */
			generateColorStops : function() {
				var colorStops = this.gradient.colStops;
				var container = document.getElementById("select-bar-" + this.parent);
				
				for(var i = 0; i < colorStops.length; i++) {
					container.appendChild(this.generateColorStop(colorStops[i], colorStops[i].id));
				}
			},
			
			/*
			 * Generate individual color stop and attach event listeners.
			 */
			generateColorStop : function(colorStop, id) {
				var container = document.createElement("div");
				var colorBox = document.createElement("div");
				
				container.setAttribute("class", "color-stop");
				container.setAttribute("color-id", id);
				container.setAttribute("parent", this.parent);
				container.setAttribute("id", "color-stop-" + this.parent + "-" + id);
				container.addEventListener("mousedown", this.moveColorStop, true);
				container.addEventListener("touchstart", this.moveColorStopTouch, true);
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
			
			/*
			 * Generate active color components, color picker, color preview and control buttons
			 */
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
				hueIndicator.addEventListener("touchstart", this.moveHueTouch, true);
				
				var colorIndicator = document.createElement("div");
				colorIndicator.setAttribute("class", "color-ind");
				colorIndicator.setAttribute("parent", this.parent);
				colorIndicator.setAttribute("id", "color-ind-" + this.parent);
				colorIndicator.addEventListener("mousedown", this.moveSL, true);
				colorIndicator.addEventListener("touchstart", this.moveSLTouch, true);
				
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
				exp.addEventListener("click", this.exportGradient, true);
				
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
			},
			
			/*
			 * Update Gradient preview
			 */
			updatePreview : function() {
				var container = document.getElementById("gen-preview-" + this.parent);
				var gradient = this.gradient.toString();
				container.setAttribute("style",
								"background-image: -webkit-" + gradient + ";" +
								"background-image: -moz-" + gradient + ";" +
								"background-image: -ms-" + gradient + ";" +
								"background-image: -o-" + gradient + ";" +
								"background-image: " + gradient + ";");
			},
			
			/*
			 * Update color stops bar and color stops
			 */
			updateGradient : function() {
				var select = document.getElementById("select-bar-" + this.parent);
				select.innerHTML = "";
				
				this.gradient.sortColor();
				this.updatePreview();
				this.generateColorStops();
			},
			
			/*
			 * Set new active color
			 */
			setActiveColor : function(id) {
				this.activeColor = id;
				var color = document.getElementById("color-preview-" + this.parent);
				var colorMap = document.getElementById("color-map-" + this.parent);
				var hueIndicator = document.getElementById("hue-ind-" + this.parent);
				var colorIndicator = document.getElementById("color-ind-" + this.parent);
				var x;
				var y;
				var active = this.gradient.getColorById(this.activeColor);
				var tempColor = this.color;
				tempColor.setRGB(active.color.r, active.color.g, active.color.b);
				tempColor.setHSL(active.color.h, active.color.s, active.color.l);
				
				x = tempColor.s;
				y = tempColor.l;
				
				y *= 2;
				
				if(y/2 - x/2 > 0) {
					y -= y/2 - x/2;
				}
				
				y = Math.abs(y - 1);
				
				//console.log("Active: Light: " + tempColor.l + ", Saturation:" + tempColor.s + " ColorIndicator: " + y + " - " + x );
				
				y = Math.floor(y * 128);
				x = Math.floor(x * 128);
				colorIndicator.style.top = y - 5 + "px";
				colorIndicator.style.left = x - 5 + "px";
				
				this.hue = tempColor.h;
				
				tempColor.setHSL(this.hue, 1.0, 0.5);
				tempColor.HSLtoRGB();
				
				color.style.backgroundColor = active.toCSS();
				colorMap.style.backgroundColor = tempColor.toCSS();
				
				y = tempColor.h;
				y = Math.abs(y - 1);
				y = Math.floor(y * 128);
				
				//console.log("Active Hue: " + tempColor.h + ", Huebar: " + y);
				
				hueIndicator.style.top = y - 5 + "px";
			},
			
			setActiveSL : function(id) {
				this.activeColor = id;
				var color = document.getElementById("color-preview-" + this.parent);
				var active = this.gradient.getColorById(this.activeColor);
				
				color.style.backgroundColor = active.toCSS();
			},
			
			/*
			 * When selecting color stop.
			 */
			selectColorStop : function(e) {
				var id = e.target.getAttribute("color-id");
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].setActiveColor(id);
			},
			
			/*
			 * Moving color stop
			 */
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
			
			/*
			 * Move color stop for Touchscreen devices
			 */
			moveColorStopTouch : function(e) {
				var elem = e.target;
				if(e.targetTouches.length == 1) {
					var touch = e.targetTouches[0];
				}
				
				if(e.target.getAttribute("class") == "color-box") {
					elem = e.target.parentNode;
				}
				var parent = elem.getAttribute("parent");
				
				WT.Desk.applications[parent].setActiveColor(elem.getAttribute("color-id"));
				
				var bar = document.getElementById("select-bar-" + parent);
				var barWidth = bar.clientWidth;
				var startX = touch.clientX;
				var deltaX = startX - elem.offsetLeft;
				
				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					var pos;
					var moveTouch = e.targetTouches[0];
					
					if(moveTouch.clientX > deltaX + barWidth) {
						pos = 100;
					} else if(moveTouch.clientX < deltaX) {
						pos = 0;
					} else {
						pos = moveTouch.clientX - deltaX + 8;
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
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					
					WT.Desk.applications[parent].updateGradient();
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			/*
			 * Moving Saturation Light controller
			 */
			moveSL : function(e) {
				var colorMap = e.target.parentNode;
				var parent = colorMap.getAttribute("parent");
				var indicator = document.getElementById("color-ind-" + parent);
				var sat;
				var light;
				var hue = WT.Desk.applications[parent].hue;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				var color = new WT.color.Color(active.color[0], active.color[1], active.color[2]);
				var x, y, xy;
				
				color.RGBtoHSL();
				
				var startX = e.clientX;
				var startY = e.clientY;
				
				var deltaX = startX - indicator.offsetLeft;
				var deltaY = startY - indicator.offsetTop;
				
				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					if(e.clientY > deltaY + 123) {
						y = 0.0;
						indicator.style.top = 123 + "px";
					} else if(e.clientY < deltaY) {
						y = 1.0;
						indicator.style.top = -5 + "px";
					} else {
						y = (e.clientY - deltaY) / 123;
						y -= 1;
						y = Math.abs(y);
						indicator.style.top = e.clientY - deltaY + "px";
					}
					
					if(e.clientX > deltaX + 123) {
						x = 1.0;
						indicator.style.left = 123 + "px";
					} else if(e.clientX < deltaX) {
						x = 0.0;
						indicator.style.left = -5 + "px";
					} else {
						x = (e.clientX - deltaX) / 123;
						indicator.style.left = e.clientX - deltaX + "px";
					}
					
					sat = x;
					active.color.setSaturation(sat);
					
					light = y / 2;
					if(y/2 - x/2 > 0) {
						light += y/2 - x/2;
					}
					
					active.color.setLight(light);
					active.color.setHue(hue);
					
					active.HSLtoRGB();
					
					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].setActiveSL(WT.Desk.applications[parent].activeColor);
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
			
			/*
			 * Move SL Touch
			 */
			moveSLTouch : function(e) {
				if(e.targetTouches.length == 1) {
					var touch = e.targetTouches[0];
				}
				var colorMap = e.target.parentNode;
				var parent = colorMap.getAttribute("parent");
				var indicator = document.getElementById("color-ind-" + parent);
				var sat;
				var light;
				var hue = WT.Desk.applications[parent].hue;
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				var color = new WT.color.Color(active.color[0], active.color[1], active.color[2]);
				var x, y, xy;
				
				color.RGBtoHSL();
				
				var startX = touch.clientX;
				var startY = touch.clientY;
				
				var deltaX = startX - indicator.offsetLeft;
				var deltaY = startY - indicator.offsetTop;
				
				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					var moveTouch = e.targetTouches[0];
					if(moveTouch.clientY > deltaY + 123) {
						y = 0.0;
						indicator.style.top = 123 + "px";
					} else if(moveTouch.clientY < deltaY) {
						y = 1.0;
						indicator.style.top = -5 + "px";
					} else {
						y = (moveTouch.clientY - deltaY) / 123;
						y -= 1;
						y = Math.abs(y);
						indicator.style.top = moveTouch.clientY - deltaY + "px";
					}
					
					if(moveTouch.clientX > deltaX + 123) {
						x = 1.0;
						indicator.style.left = 123 + "px";
					} else if(moveTouch.clientX < deltaX) {
						x = 0.0;
						indicator.style.left = -5 + "px";
					} else {
						x = (moveTouch.clientX - deltaX) / 123;
						indicator.style.left = moveTouch.clientX - deltaX + "px";
					}
					
					sat = x;
					active.color.setSaturation(sat);
					
					light = y / 2;
					if(y/2 - x/2 > 0) {
						light += y/2 - x/2;
					}
					
					active.color.setLight(light);
					active.color.setHue(hue);
					
					active.HSLtoRGB();
					
					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].setActiveSL(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].updateGradient();
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			/*
			 * Move Hue controller.
			 */
			moveHue : function(e) {
				var hueBar = e.target.parentNode;
				var indicator = e.target;
				var hue;
				var parent = hueBar.getAttribute("parent");
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				
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
						hue = 0.993;
						indicator.style.top = -5 + "px";
					} else {
						hue = (e.clientY - deltaY + 1) / 128;
						hue -= 1;
						hue = Math.abs(hue);
						indicator.style.top = e.clientY - deltaY + "px";
					}
					
					active.color.setHue(hue);
					active.HSLtoRGB();
					
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
			
			/*
			 * Move hue Touch
			 */
			moveHueTouch : function(e) {
				if(e.targetTouches.length == 1) {
					var touch = e.targetTouches[0];
				}
				var hueBar = e.target.parentNode;
				var indicator = e.target;
				var hue;
				var parent = hueBar.getAttribute("parent");
				var active = WT.Desk.applications[parent].gradient.getColorById(WT.Desk.applications[parent].activeColor);
				
				var startY = touch.clientY;
				var deltaY = startY - indicator.offsetTop - 5;
				
				document.addEventListener("touchmove", moveHandler, true);
				document.addEventListener("touchend", upHandler, true);
				
				e.stopPropagation();
				e.preventDefault();
				
				function moveHandler(e) {
					var moveTouch = e.targetTouches[0];
					if(moveTouch.clientY > deltaY + 128) {
						hue = 0.0;
						indicator.style.top = 123 + "px";
					} else if(moveTouch.clientY < deltaY) {
						hue = 0.993;
						indicator.style.top = -5 + "px";
					} else {
						hue = (moveTouch.clientY - deltaY + 1) / 128;
						hue -= 1;
						hue = Math.abs(hue);
						indicator.style.top = moveTouch.clientY - deltaY + "px";
					}
					
					active.color.setHue(hue);
					active.HSLtoRGB();
					
					WT.Desk.applications[parent].gradient.setColorById(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
					WT.Desk.applications[parent].updateGradient();
					
					
					e.stopPropagation();
					e.preventDefault();
				}
				
				function upHandler(e) {
					document.removeEventListener("touchend", upHandler, true);
					document.removeEventListener("touchmove", moveHandler, true);
					
					e.stopPropagation();
					e.preventDefault();
				}
			},
			
			/*
			 * Remove color stop
			 */
			removeColor : function(e) {
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].activeColor = WT.Desk.applications[parent].gradient.removeOldColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			/*
			 * Add color stop
			 */
			addColor : function(e) {
				var parent = e.target.getAttribute("parent");
				WT.Desk.applications[parent].activeColor = WT.Desk.applications[parent].gradient.addNewColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].setActiveColor(WT.Desk.applications[parent].activeColor);
				WT.Desk.applications[parent].updateGradient();
			},
			
			/*
			 * Export to CSS
			 */
			exportGradient : function(e) {
				var parent = e.target.getAttribute("parent");
				var wteditId;
				var gradientSrc = WT.Desk.applications[parent].gradient.toRichText();
				WT.Desk.addApplication(WT.wtedit.Application);
				wteditId = WT.Desk.nextId - 1;
				WT.Desk.applications[wteditId].setSource(gradientSrc);
				//WT.Desk.applications[wteditId].setMode(false);
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
				this.addColor([0, 255, 0], 0, "%");
				this.addColor([0, 0, 255], 50, "%");
				this.addColor([255, 0, 0], 100, "%");
			},
			
			addColor : function(colors, pos, type) {
				var temp = new WT.gradient.ColorStop(colors, pos, type, this.nextId);
				temp.RGBtoHSL();
				this.nextId++;
				this.colStops.push(temp);
			},
			
			addNewColor : function(id) {
				var activeColor;
				var nextColor;
				var hue;
				var sat;
				var light;
				var pos;
				var tempColor = new WT.color.Color(0, 0, 0);
				
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
				
				if(activeColor.color.hue > nextColor.color.hue) {
					var temp = activeColor.color.h - nextColor.color.h;
					hue = nextColor.color.h + (temp/2);
				} else {
					var temp = nextColor.color.h - activeColor.color.h;
					hue = activeColor.color.h + (temp/2);
				}
				
				if(activeColor.color.s > nextColor.color.s) {
					var temp = activeColor.color.s - nextColor.color.s;
					sat = nextColor.color.s + (temp/2);
				} else {
					var temp = nextColor.color.s - activeColor.color.s;
					sat = activeColor.color.s + (temp/2);
				}
				
				if(activeColor.color.l > nextColor.color.l) {
					var temp = activeColor.color.l - nextColor.color.l;
					light = nextColor.color.l + (temp/2);
				} else {
					var temp = nextColor.color.l - activeColor.color.l;
					light = activeColor.color.l + (temp/2);
				}
				
				if(activeColor.position > nextColor.position) {
					var temp = activeColor.position - nextColor.position;
					pos = Math.floor(nextColor.position + (temp/2));
				} else {
					var temp = nextColor.position - activeColor.position;
					pos = Math.floor(activeColor.position + (temp/2));
				}
				tempColor.setHSL(hue, sat, light);
				tempColor.HSLtoRGB();
				
				var temp = new WT.gradient.ColorStop([tempColor.r, tempColor.g, tempColor.b], pos, "%", this.nextId);
				temp.RGBtoHSL();
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
			},
			
			toRichText : function() {
				var str;
				var gradient = this.toString();
				
				str = "<div style=\"width: 280px; height: 32px; border: 1px solid black; " +
					"background-image: -webkit-" + gradient + "; " +
					"background-image: -moz-" + gradient + "; " +
					"background-image: -ms-" + gradient + "; " +
					"background-image: -o-" + gradient + "; " +
					"background-image: " + gradient + ";\"> " +
					"</div>" +
					"<h3>Gradient CSS code</h3>" + 
					"<div style='width: 280px; font-size: 12px; font-family: \"Lucida Console\", Monaco, monospace;'>" +
					"background-image: -webkit-" + gradient + "; <br />" +
					"background-image: -moz-" + gradient + "; <br />" +
					"background-image: -ms-" + gradient + "; <br />" +
					"background-image: -o-" + gradient + "; <br />" +
					"background-image: " + gradient + "; <br />" +
					"</div>";
				
				return str;
			}
		};
		return gradient;
	},

	ColorStop : function(col, pos, posT, i) {
		var cs = {
			position : pos || 0,
			color : new WT.color.Color(col[0], col[1], col[2]),
			posType : posT || "%",
			id : i || 0,
			
			setRGB : function(r, g, b) {
				this.color.setRGB(r, g, b);
			},
			
			setHSL : function(h, s, l) {
				this.color.setHSL(h, s, l);
			},
			
			RGBtoHSL : function() {
				this.color.RGBtoHSL();
			},
			
			HSLtoRGB : function() {
				this.color.HSLtoRGB();
			},
			
			setPosition : function(value, type) {
				this.position = value;
				this.posType = type;
			},
			
			toString : function() {
				return "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b
						+ ") " + this.position + this.posType;
			},
			
			toCSS : function() {
				return "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b
				+ ")";
			}
		};
		return cs;
	}
};