/* WebTop WtEdit
 * -------------
 * WtEdit is WebTops basic text editor! This will be a very good lesson for me to
 * make a WYSIWYG like text editor that I can use in future projects as well.
 * I also need this to display text based projects
 * 
 * 
 */
WT.wtedit = {
	Application : function(parId) {
		var app = {
			parent : parId,
			portalSettings : { width : 316, height : 308, fixed : false, footer : true, title : "WtEdit 0.2"},
			iconSettings : { img : "img/wt-icon-gradient.png", app : WT.gradient.Application, title : "WtEdit" },
			menu : new WT.menu.MenuBar(parId),
			toolbar : new WT.toolbar.ToolBar(parId),
			document : null,
			
			init : function() {
				this.generateContainer();
				this.generateMenu();
				this.generateToolBar();
				
				// Custom eventlistener for the portal on resize!
				this.setCustomResizeEvent();
				//this.afterInit();
			},
			
			afterInit : function() {
				var ifr = document.getElementById("wtedit-textcanvas-" + this.parent);
				ifr.contentWindow.document.designMode = "on";
				this.document = ifr.contentWindow.document;
				console.log("DesignMode: " + ifr.contentWindow.document.designMode);
			},
			
			setCustomResizeEvent : function() {
				var handle = document.getElementById("portal-handle-" + this.parent);
				handle.addEventListener("mousedown", this.resize, true);
			},
			
			resize : function(event) {
				var parent = event.target.getAttribute("parent");
				var element = document.getElementById("wtedit-textcanvas-" + parent);
				var startX = event.clientX;
				var startY = event.clientY;

				var origX = element.offsetLeft;
				var origY = element.offsetTop;

				var deltaX = startX - origX;
				var deltaY = startY - origY;

				var startWidth = Number(element.getAttribute("width"));
				var startHeight = Number(element.getAttribute("height"));

				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);

				event.stopPropagation();
				event.preventDefault();
				
				function moveHandler(e) {
					width = e.clientX - deltaX - origX + startWidth;
					height = e.clientY - deltaY - origY + startHeight;
					//console.log("New Width: " + width + " - Height: " + height);
					
					if (width > 70) {
						element.setAttribute("width", width);
					} else {
						element.setAttribute("width", 70);
					}

					if (height > 70) {
						element.setAttribute("height", height);
					} else {
						element.setAttribute("height", 70);
					}

					e.stopPropagation();
				}

				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					e.stopPropagation();
				}
			},
			
			generateContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);
				var textInput = document.createElement("textarea");
				var textCanvas = document.createElement("iframe");
				
				container.setAttribute("id", "wtedit-container-" + this.parent);
				container.setAttribute("class", "wtedit-container");
				
				textInput.setAttribute("id", "wtedit-textarea-" + this.parent);
				textInput.setAttribute("parent", this.parent);
				textInput.setAttribute("class", "wtedit-textarea");
				//textInput.addEventListener("keyup", this.changeDocument, true);
				
				textCanvas.setAttribute("id", "wtedit-textcanvas-" + this.parent);
				textCanvas.setAttribute("name", "wtedit-textcanvas-" + this.parent);
				textCanvas.setAttribute("class", "wtedit-textcanvas");
				textCanvas.setAttribute("width", this.portalSettings.width);
				textCanvas.setAttribute("height", this.portalSettings.height - 40);
				
				//textCanvas.addEventListener("click", this.focusTextArea, true);
				
				container.appendChild(textInput);
				container.appendChild(textCanvas);
				
				parentElem.appendChild(container);
				
				parentElem.appendChild(this.toolbar.generateToolBar());
				parentElem.appendChild(this.menu.generateMenuBar());
				
				//this.document = textCanvas.contentDocument;
				//textCanvas.contentDocument.designMode = "on";
				//ifr.contentWindow.document.designMode = "on";
				
				this.document = textCanvas.contentWindow.document;
				this.document.designMode = "on";
			},
			
			generateMenu : function() {
				this.menu.addMenu("File");
				this.menu.menus["File"].setWidth(60);
				this.menu.menus["File"].addMenuItem("Open");
				this.menu.menus["File"].menuItems["Open"].setAction(WT.Desk.applications[this.parent].showAlert);
				this.menu.menus["File"].addMenuItem("Save");
				this.menu.menus["File"].addMenuItem("Save As");
				this.menu.menus["File"].addMenuItem("Exit");
				this.menu.addMenu("Edit");
				this.menu.menus["Edit"].setWidth(80);
				this.menu.menus["Edit"].addMenuItem("Clear");
				this.menu.menus["Edit"].addMenuItem("Insert URL");
				this.menu.menus["Edit"].addMenuItem("Insert Image");
				this.menu.menus["Edit"].addMenuItem("Edit Source");
				this.menu.menus["Edit"].menuItems["Edit Source"].setAction(WT.Desk.applications[this.parent].switchModes);
				this.menu.addMenu("Help");
				this.menu.menus["Help"].setWidth(60);
				this.menu.menus["Help"].addMenuItem("About");
			},
			
			generateToolBar : function() {
				this.toolbar.addTool("New");
				this.toolbar.items["New"].setIcon("img/wtedit/icon_new.png");
				this.toolbar.items["New"].setAction(WT.Desk.applications[this.parent].deleteAll);
				this.toolbar.addTool("Save");
				this.toolbar.items["Save"].setIcon("img/wtedit/icon_save.png");
				this.toolbar.addTool("Bold");
				this.toolbar.items["Bold"].setIcon("img/glyph/glyphicons_102_bold.png");
				this.toolbar.items["Bold"].setAction(WT.Desk.applications[this.parent].toggleBold);
				this.toolbar.addTool("Italic");
				this.toolbar.items["Italic"].setIcon("img/glyph/glyphicons_101_italic.png");
				this.toolbar.items["Italic"].setAction(WT.Desk.applications[this.parent].toggleItalic);
				this.toolbar.addTool("Underline");
				this.toolbar.items["Underline"].setIcon("img/glyph/glyphicons_103_text_underli.png");
				this.toolbar.items["Underline"].setAction(WT.Desk.applications[this.parent].toggleUnderline);
				this.toolbar.addTool("Strike");
				this.toolbar.items["Strike"].setIcon("img/glyph/glyphicons_104_text_strike.png");
				this.toolbar.items["Strike"].setAction(WT.Desk.applications[this.parent].toggleStroke);
				this.toolbar.addTool("Left_Aligned");
				this.toolbar.items["Left_Aligned"].setIcon("img/glyph/glyphicons_110_align_left.png");
				this.toolbar.items["Left_Aligned"].setAction(WT.Desk.applications[this.parent].leftAlign);
				this.toolbar.addTool("Center_Aligned");
				this.toolbar.items["Center_Aligned"].setIcon("img/glyph/glyphicons_111_align_center.png");
				this.toolbar.items["Center_Aligned"].setAction(WT.Desk.applications[this.parent].centerAlign);
				this.toolbar.addTool("Right_Aligned");
				this.toolbar.items["Right_Aligned"].setIcon("img/glyph/glyphicons_112_align_right.png");
				this.toolbar.items["Right_Aligned"].setAction(WT.Desk.applications[this.parent].rightAlign);
			},
			
			showAlert : function(message) {
				alert(message);
			},
			
			/*
			changeDocument : function(event) {
				var target = event.target;
				var value = target.value;
				var parent = target.getAttribute("parent");
				var canvas = document.getElementById("wtedit-textcanvas-" + parent);
				
				canvas.innerHTML = value;
			},
			
			focusTextArea : function(event) {
				var parent = event.target.getAttribute("parent");
				var textArea = document.getElementById("wtedit-textarea-" + parent);
				
				textArea.focus;
			}*/
			
			switchModes : function(event) {
				var parent = event.target.getAttribute("parent");
				var textArea = document.getElementById("wtedit-textarea-" + parent);
				var canvas = WT.Desk.applications[parent].document.body;
				var iframe = document.getElementById("wtedit-textcanvas-" + parent);
				var value;
				
				if(textArea.style.display == "none") {
					value = canvas.innerHTML;
					textArea.value = value;
					iframe.style.display = "none";
					textArea.style.display = "block";
				} else {
					value = textArea.value;
					canvas.innerHTML = value;
					textArea.style.display = "none";
					iframe.style.display = "block";
				}
			},
			
			setSource : function(source) {
				var textArea = document.getElementById("wtedit-textarea-" + this.parent);
				var canvas = WT.Desk.applications[this.parent].document.body;
				
				textArea.value = source;
				canvas.innerHTML = source;
			},
			
			setMode : function(mode) {
				var textArea = document.getElementById("wtedit-textarea-" + this.parent);
				var iframe = document.getElementById("wtedit-textcanvas-" + this.parent);
				
				if(!mode) {
					iframe.style.display = "none";
					textArea.style.display = "block";
				} else {
					textArea.style.display = "none";
					iframe.style.display = "block";
				}
			},
			
			toggleBold : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("bold", false, null);
			},
			
			toggleItalic : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("italic", false, null);
			},
			
			toggleUnderline : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("underline", false, null);
			},
			
			toggleStroke : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("strikeThrough", false, null);
			},
			
			leftAlign : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("justifyLeft", false, null);
			},
			
			centerAlign : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("justifyCenter", false, null);
			},
			
			rightAlign : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("justifyRight", false, null);
			},
			
			deleteAll : function(event) {
				var parent = event.target.getAttribute("parent");
				var canvas = WT.Desk.applications[parent].document;
				
				canvas.execCommand("selectAll", false, null);
				canvas.execCommand("delete", false, null);
			}
		};
		return app;
	}	
};