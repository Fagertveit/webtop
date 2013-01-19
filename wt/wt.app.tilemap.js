
/*---------------------------------------
 * WebTop Application - TileMap Editior
 * --------------------------------------
 * The tilemap editor will be a general purpouse tool to make tilemaps for me games.
 * I will make it compatible with most of the games that use tilemaps that I've made
 * so that I can continue to develop this titles to a finished state.
 * It'll be a great tool to utilize in the future as well as I'm bound to make many a
 * games that depend on solid good tilemaps!
 * Right now there is two games that would need a tilemap editor, these are
 * * Cthulhu Breaker
 * * Nuke Mutants: Adventures
 * 
 * I need to plan out the development of this application so that I get to work on the
 * most importaint stuff first and then move on to work with minor features that will
 * spice the application up some and make it sparkling pretty!
 * 
 * One of the first features I need to get going is the Map creation flow. I need to be
 * able to select "New" in the files menu and get a custom dialog that will let me enter
 * the needed data to generate a blank map to work with.
 * 
 * Next step is to get tile import working, I need to be able to load a image that I can
 * extract tiles from, these I will then be able to select through the Tilette to place
 * tiles on the map.
 * 
 * For the next step I need to get the toolbar working, for this I will need to figure out
 * what sort of tools I need to create awesome tile maps, and then make some sort of placeholder
 * icons that I can use as tool representations.
 * 
 * As a bonus I want to put tilemap documents in a tabbed pane that I can switch between,
 * when one pane is active all actions taken will affect that document only.
 * 
 * Above that there will be a lot of esoteric workings in the background, I want to make a
 * somewhat advanced tile editor so that I can import and maybe generate tilesets inside
 * the application and export the custom set as a png.
 * 
 * Need to check into both importing and exporting images, as well as files.
 * HTML5 Files API seems to be the key here! :D
 */
WT.app.tilemap = {
	App : function(srcParent) {
		var tilemap = {
			parent : srcParent,
			toolbar : null,
			tilette : null,
			tilefo : null,
			about : null,
			portal : null,
			icon : null,
			title : null,
			tileset : null,
			documents : new Array(),
			map : null,
			selection : null,
			mode : 0,
			
			init : function() {
				this.portal = this.parent.addPortal("Tilemap Editor 0.1", 600, 400);
				this.initMenu();
				this.initTileMap();
				this.tileset = new WT.app.tilemap.TileSet(this);
				this.initSubs();
				this.setMode(1);
			},
			
			initTileMap : function() {
				var _this = this;
				var container = document.getElementById("portal_container-" + this.portal.id);
				/*
				container.addEventListener("mousedown", function(event) {
					_this.trackMouseMovement(event);
				}, true);
				*/
				var tilemap = new WT.app.tilemap.TileMap(this, 32, 32, 32, 32, "Test");
				tilemap.init();
				this.map = tilemap;
				container.appendChild(tilemap.generateDivMap());
			},
			
			generateTileMap : function(params) {
				var container = document.getElementById("portal_container-" + this.portal.id);
				var tilemap = new WT.app.tilemap.TileMap(this, params.width, params.height, params.tileWidth, params.tileHeight, params.title, params.description);
				tilemap.init();
				this.map = tilemap;
				container.innerHTML = "";
				container.appendChild(tilemap.generateDivMap());
			},
			
			initSubs : function() {
				this.toolbar = this.portal.addSubPortal(" ");
				this.toolbar.setWidth(36);
				this.toolbar.setHeight(197);
				this.toolbar.setPosition(50, 90);
				this.initToolbar();
				this.tilette = this.portal.addSubPortal("Tilette");
				this.tilette.setWidth(200);
				this.tilette.setHeight(200);
				this.tilette.setPosition(350, 170);
				this.initTilette();
				this.tilefo = this.portal.addSubPortal("Tilefo");
				this.tilefo.setSize(120, 90);
				this.tilefo.setPosition(350, 50);
				this.initTilefo();
				this.about = this.portal.addSubPortal("About");
				this.about.setSize(200, 250);
				this.about.setPosition(200, 100);
				this.initAbout();
				this.about.toggle();
			},
			
			initToolbar : function() {
				var _this = this;
				var cont = document.getElementById("subportal_container-" + this.toolbar.id + "-" + this.portal.id);
				var btnInfo, btnAdd, btnRemove, btnFill, btnMark;
				
				btnInfo = WT.dom.createDiv(
					{"id" : "wtedit_btn_info",
					"class" : "tool_btn btn_info",
					"ref" : "info"}
				);
				btnInfo.addEventListener("click", function() {_this.setMode(0);}, true);
				
				btnAdd = WT.dom.createDiv(
					{"id" : "wtedit_btn_add",
					"class" : "tool_btn btn_add",
					"ref" : "add"}
				);
				btnAdd.addEventListener("click", function() {_this.setMode(1);}, true);
				
				btnRemove = WT.dom.createDiv(
					{"id" : "wtedit_btn_remove",
					"class" : "tool_btn btn_remove",
					"ref" : "remove"}
				);
				btnRemove.addEventListener("click", function() {_this.setMode(2);}, true);
				
				btnFill = WT.dom.createDiv(
					{"id" : "wtedit_btn_fill",
					"class" : "tool_btn btn_fill",
					"ref" : "fill"}
				);
				btnFill.addEventListener("click", function() {_this.setMode(3);}, true);
				
				btnMark = WT.dom.createDiv(
					{"id" : "wtedit_btn_mark",
					"class" : "tool_btn btn_mark",
					"ref" : "mark"}
				);
				btnMark.addEventListener("click", function() {_this.setMode(4);}, true);
				
				cont.appendChild(btnInfo);
				cont.appendChild(btnAdd);
				cont.appendChild(btnRemove);
				cont.appendChild(btnFill);
				cont.appendChild(btnMark);
			},
			
			initTilette : function() {

				var _this = this;
				var cont = document.getElementById("subportal_container-" + this.tilette.id + "-" + this.portal.id);
				cont.style.height = "100%";
				cont.style.width = "100%";
				cont.style.backgroundColor = "#ddd";
				cont.parentNode.style.overflow = "hidden";

				var selectedTile = WT.dom.createDiv(
					{"id" : "tilette_active",
					"class" : "tilette_active"},
					{"position" : "absolute",
					"top" : "4px",
					"left" : "0px",
					"right" : "0px",
					"height" : (_this.map.sizeY + 6) + "px",
					"borderBottomStyle" : "dotted",
					"borderBottomWidth" : "1px",
					"borderBottomColor" : "#666"}
				);
				//selectedTile.innerHTML = "Selected Tile!";

				var tilePrev = WT.dom.createDiv(
					{"id" : "tilette_tile_prev",},
					{"position" : "absolute",
					"top" : "2px",
					"left" : "2px",
					"width" : (_this.map.sizeX) + "px",
					"height" : (_this.map.sizeY) + "px",
					"borderStyle" : "solid",
					"borderWidth" : "1px",
					"borderColor" : "#666",
					"backgroundColor" : "#fff"
					}
				);

				var tilePrevImg = document.createElement("img");
				tilePrevImg.setAttribute("src", WT.data.BLANK_IMG);
				tilePrev.appendChild(tilePrevImg);

				var activeInput = document.createElement("input");
				activeInput.style.width = "32px";
				activeInput.style.borderStyle = "solid";
				activeInput.style.borderColor = "#666";
				activeInput.style.borderWidth = "1px";
				activeInput.style.position = "absolute";
				activeInput.style.left = (_this.map.sizeX + 12) + "px";
				activeInput.style.top = "14px";
				activeInput.value = 1;

				activeInput.addEventListener("change", function() {
					_this.tileset.activeId = parseInt(activeInput.value);
				}, true);

				var activeIdLabel = WT.dom.createDiv(
					{"id" : "tilette_id_label"},
					{"position" : "absolute",
					"top" : "2px",
					"left" : (_this.map.sizeX + 12) + "px",
					"fontSize" : "10px"
				}
				);
				activeIdLabel.innerHTML = "ActiveID"

				selectedTile.appendChild(tilePrev);
				selectedTile.appendChild(activeInput);
				selectedTile.appendChild(activeIdLabel);

				cont.appendChild(selectedTile);

				var tileCont = WT.dom.createDiv(
					{"id" : "tilette",
					"class" : "tilette"},
					{"position" : "absolute",
					"top" : (_this.map.sizeY + 12) + "px",
					"left" : "0px",
					"right" : "0px",
					"bottom" : "0px",
					"width" : "100%",
					"height" : (176 - (_this.map.sizeY + 6)) + "px",
					"backgroundColor" : "#fff"
					}
				);

				cont.appendChild(tileCont);
			},
			
			initTilefo : function() {
				var _this = this;
				var cont = document.getElementById("subportal_container-" + this.tilefo.id + "-" + this.portal.id);
				cont.style.width = "100%";
				cont.style.height = "100%";
				cont.style.backgroundColor = "#ddd";
				cont.parentNode.style.overflow = "hidden";

				var tileSprite = WT.dom.createDiv(
					{"id" : "tilefo_sprite",
					"class" : "tilefo_sprite"},
					{"width" : (this.map.sizeX + 4) + "px",
					"height" : (this.map.sizeY + 4) + "px",
					"backgroundColor" : "#fff",
					"borderStyle" : "solid",
					"borderWidth" : "1px",
					"borderColor" : "#666",
					"position" : "absolute",
					"top" : "24px",
					"left" : "4px"
				});

				var data = document.createElement("input");
				data.setAttribute("id", "tilefo_input");
				data.style.width = "32px";
				data.style.borderStyle = "solid";
				data.style.borderWidth = "1px";
				data.style.borderColor = "#666";
				data.style.position = "absolute";
				data.style.left = (_this.map.sizeX + 16) + "px";
				data.style.top = "40px";


				data.addEventListener("change", function() {
					_this.map.setDataId(_this.activeTile, data.value);
				}, true);

				var dataLabel = WT.dom.createDiv(
					{"class" : "tilefo_datalabel"},
					{"position" : "absolute",
					"left" : (_this.map.sizeX + 16) + "px",
					"top" : "24px",
					"fontSize" : "12px"
				});

				dataLabel.innerHTML = "Data ID";

				var tileInfo = WT.dom.createDiv(
					{"id" : "tilefo_tileinfo",
					"class" : "tilefo_tilefo"},
					{"position" : "absolute",
					"left" : "4px",
					"top" : "4px",
					"fontSize" : "12px",
					"fontWeight" : "bold"
					});

				tileInfo.innerHTML = "Tile: 1-1, ID: 0";

				cont.appendChild(tileSprite);
				cont.appendChild(data);
				cont.appendChild(dataLabel);
				cont.appendChild(tileInfo);
			},

			initAbout : function() {
				var _this = this;
				var title, version, description, closeBtn, cont;
				cont = document.getElementById("subportal_container-" + this.about.id + "-" + this.portal.id);
				cont.style.backgroundColor = "#ddd";
				cont.style.width = "100%";
				cont.style.height = "100%";
				cont.parentNode.style.overflow = "hidden";

				title = WT.dom.createDiv({"id" : "about-" + this.about.id, "class" : "about_title"});
				title.innerHTML = "WebTop Tilemap Editor";
				version = WT.dom.createDiv({"id" : "about_version-" + this.about.id, "class" : "about_version"});
				version.innerHTML = "Version: 0.1a";
				description = WT.dom.createDiv({"id" : "about_desc-" + this.about.id, "class" : "about_desc"});
				description.innerHTML = "WebTop Tilemap Editor was created by Glenn Fagertveit as a tool for his infernal game development projects, this tool will continue to evolve till the day Glenn dies, or finds a better platform to develop with. This editor is planed to work as a online tool for other developers as well who needs to get a fast and simple tilemap editor to work against. Now Glenn needs beer, or tea.";
				closeBtn = WT.dom.createDiv({"id" : "about_close-" + this.about.id + "-" + this.portal.id, "class" : "btn about_btn"});
				closeBtn.innerHTML = "Close"
				closeBtn.addEventListener("click", function() {
					_this.toggleSub({"sub" : "about", "that" : _this});
				});

				cont.appendChild(title);
				cont.appendChild(version);
				cont.appendChild(description);
				cont.appendChild(closeBtn);
			},
		
			initMenu : function() {
				var _this = this;
				this.portal.addMenuBar();
				this.portal.addMenu("File");
				this.portal.addMenu("Edit");
				this.portal.addMenu("Tileset");
				this.portal.addMenu("View");
				this.portal.addMenu("Help");
				this.portal.addMenuItem("File", "New", _this.newTileMap);
				this.portal.menu.menus["File"].items["New"].setAttributes({"that" : _this});
				this.portal.addMenuItem("File", "Open", _this.openTileMap);
				this.portal.menu.menus["File"].items["Open"].setAttributes({"that" : _this});
				this.portal.addMenuItem("File", "Save", _this.saveFile);
				this.portal.menu.menus["File"].items["Save"].setAttributes({"that" : _this});
				this.portal.addMenuItem("File", "Export", _this.exportMap);
				this.portal.menu.menus["File"].items["Export"].setAttributes({"that" : _this});
				this.portal.menu.menus["File"].addDelimiter();
				this.portal.addMenuItem("File", "Exit", _this.exitApplication);
				this.portal.menu.menus["File"].items["Exit"].setAttributes({"that" : _this})
				this.portal.addMenuItem("Edit", "Copy");
				this.portal.addMenuItem("Edit", "Paste");
				this.portal.addMenuItem("Edit", "Clear");
				this.portal.menu.menus["Edit"].addDelimiter();
				this.portal.addMenuItem("Edit", "Settings");
				this.portal.addMenuItem("Tileset", "Load", _this.loadTileSet);
				this.portal.menu.menus["Tileset"].items["Load"].setAttributes({"that" : _this});
				this.portal.addMenuItem("Tileset", "Edit");
				this.portal.addMenuItem("View", "Toolbar", _this.toggleSub);
				this.portal.menu.menus["View"].items["Toolbar"].setAttributes({"src" : "tool", "that" : _this});
				this.portal.addMenuItem("View", "Tilefo", _this.toggleSub);
				this.portal.menu.menus["View"].items["Tilefo"].setAttributes({"src" : "info", "that" : _this});
				this.portal.addMenuItem("View", "Tilette", _this.toggleSub);
				this.portal.menu.menus["View"].items["Tilette"].setAttributes({"src" : "tile", "that" : _this});
				this.portal.addMenuItem("Help", "About", _this.toggleSub);
				this.portal.menu.menus["Help"].items["About"].setAttributes({"src" : "about", "that" : _this});
			},
			
			/* --------------------------------------------
			 * Function: newTileMap
			 * --------------------------------------------
			 * Params:
			 *  attr.that: reference to the application.
			 * --------------------------------------------
			 * This function is used to display a portal where the user can specify
			 * a new tilemap, he can either click cancel or the X (close) button and
			 * which will result in nothing or specify a map that will be generated
			 * in the application and then ready to edit.
			 * 
			 * ToDo:
			 * * The tilemap will have the following properties
			 *  * Name(input) - The title of the map
			 *  * Description(textarea) - A short description of the tilemap
			 *  * Type(select) - The type of tilemap (Default, Hexagonal, Isometric)
			 *  * Data type(select) - The type of data each tile will hold, will be presets
			 *  * Width(input) - The amount of tiles that goes into the width of the map
			 *  * Height(input) - The amount of tiles that goes into the height of the map
			 *  * Tile Width(input) - The pixel width of a tile
			 *  * Tile Height(input) - The pixel height of a tile
			 */
			newTileMap : function(attr) {
				var _this = attr.that;
				var ntmPortal = _this.portal.addSubPortal("New Tilemap");
				ntmPortal.setSize(200, 280);
				ntmPortal.setPosition(40, 40);
				ntmPortal.setOnClose(true);
				
				var cont = document.getElementById("subportal_container-" + ntmPortal.id + "-" + _this.portal.id);
				cont.style.maxWidth = "200px";
				cont.style.height = "100%";
				cont.style.backgroundColor = "#ddd";
				
				cont.parentNode.style.overflow = "hidden";

				var nameLabel = WT.dom.createDiv({"class" : "label"});
				nameLabel.innerHTML = "Map Name:";
				
				var name = WT.dom.createFormElement("input", 
					{"name" : "name", "id" : "ntm_name", "class" : "ntm_input"}
				);
				
				var descLabel = WT.dom.createDiv({"class" : "label"});
				descLabel.innerHTML = "Description: ";
				
				var desc = WT.dom.createFormElement("textarea", 
					{"name" : "description", "id" : "ntm_desc", "class" : "ntm_input"}
				);
				
				var typeLabel = WT.dom.createDiv({"class" : "label"});
				typeLabel.innerHTML = "Map type: ";
				
				var type = WT.dom.createFormElement("select", 
					{"name" : "type", "id" : "ntm_type", "class" : "ntm_input"},
					{"rectangular" : "Map Type", "rectangular" : "Rectangular", "hexagonal" : "Hexagonal", "isometric" : "Isometric"}
				);
				
				var dataLabel = WT.dom.createDiv({"class" : "label"});
				dataLabel.innerHTML = "Tile data type: ";
				
				var dataType = WT.dom.createFormElement("select", 
					{"name" : "data_type", "id" : "ntm_data_type", "class" : "ntm_input"},
					{"default" : "Tile Data Type", "default" : "Default", "2" : "2 Datafields"}
				);
				
				var sizeCont = WT.dom.createDiv(
					{"class" : "ntm_size_cont"}, 
					{"margin" : "2px", "float" : "left", "width" : "86px"}
				);
				
				var tileCont = WT.dom.createDiv(
					{"class" : "ntm_size_cont"}, 
					{"margin" : "2px", "float" : "right", "width" : "86px"}
				);
				
				var sizeLabel = WT.dom.createDiv({"class" : "small_label"});
				sizeLabel.innerHTML = "Map Size: ";
				
				var width = WT.dom.createFormElement("input", 
					{"name" : "width", "id" : "ntm_width", "class" : "ntm_small_input", "value" : "32"}
				);
				
				var height = WT.dom.createFormElement("input", 
					{"name" : "height", "id" : "ntm_height", "class" : "ntm_small_input", "value" : "32"}
				);
				
				var tileLabel = WT.dom.createDiv({"class" : "small_label"});
				tileLabel.innerHTML = "Tile Size:";
			
				var tileWidth = WT.dom.createFormElement("input", 
					{"name" : "tile_width", "id" : "ntm_tile_width", "class" : "ntm_small_input", "value" : "32"}
				);
				
				var tileHeight = WT.dom.createFormElement("input", 
					{"name" : "tile_height", "id" : "ntm_tile_height", "class" : "ntm_small_input", "value" : "32"}
				);
				
				var okBtn = WT.dom.createDiv({"id" : "ntm_ok_btn", "class" : "btn"});
				okBtn.innerHTML = "Create";
				okBtn.addEventListener("click", function() {
					console.log("Create Map!");
					// Create mapdata and render the new map and close portal!
					var params = new Object();
					params.width = width.value;
					params.height = height.value;
					params.tileWidth = tileWidth.value;
					params.tileHeight = tileHeight.value;
					params.title = name.value;
					params.description = desc.value;
					// Check so that all values are set
					if(WT.util.isNumber(params.width) &&
					   WT.util.isNumber(params.height) &&
					   WT.util.isNumber(params.tileWidth) &&
					   WT.util.isNumber(params.tileHeight)) {
						_this.generateTileMap(params);
						ntmPortal.terminate(ntmPortal);
					} else {
						alert("Some fields needs to be set");
					}
					
				}, true);
				
				var cancelBtn = WT.dom.createDiv({"id" : "ntm_cancel_btn", "class" : "btn"});
				cancelBtn.innerHTML = "Cancel";
				cancelBtn.addEventListener("click", function() {
					console.log("Cancel Map!");
					ntmPortal.terminate(ntmPortal);
				}, true);
				
				sizeCont.appendChild(sizeLabel);
				sizeCont.appendChild(width);
				sizeCont.appendChild(height);
				
				tileCont.appendChild(tileLabel);
				tileCont.appendChild(tileWidth);
				tileCont.appendChild(tileHeight);
				
				cont.appendChild(nameLabel);
				cont.appendChild(name);
				cont.appendChild(descLabel);
				cont.appendChild(desc);
				cont.appendChild(typeLabel);
				cont.appendChild(type);
				cont.appendChild(dataLabel);
				cont.appendChild(dataType);
				cont.appendChild(sizeCont);
				cont.appendChild(tileCont);
				
				cont.appendChild(okBtn);
				cont.appendChild(cancelBtn);
			},

			/* function - openTileMap
			* ------------------------
			* Need to load the tileset first so that the graphics are present
			* when I start to parse the tile data.
			*/
			openTileMap : function(attr) {
				var _this = attr.that;
				console.log("Open ze map!");
				var otmPortal = _this.portal.addSubPortal("Open Tilemap");
				otmPortal.setSize(200, 60);
				otmPortal.setOnClose(true);

				var cont = document.getElementById("subportal_container-" + otmPortal.id + "-" + _this.portal.id);
				var file = document.createElement("input");

				file.setAttribute("type", "file");
				file.setAttribute("id", "tilemap_file");
				file.style.marginTop = "10px";
				file.style.marginLeft = "10px";
				file.addEventListener("change", loadTileMap, false);

				cont.style.backgroundColor = "#ddd";
				cont.style.width = "100%";
				cont.style.height = "100%";
				cont.parentNode.style.overflow = "hidden";

				cont.appendChild(file);

				function loadTileMap(event) {
					console.log("Loading file!");
					var file = event.target.files;
					var type = file[0].type;
					var fileName = file[0].name;
					
					if(type == "text/xml") {
						console.log("Excellent!");
						
						var reader = new FileReader();
						reader.addEventListener("load", function(e) {
							var mapRaw = e.target.result;
							var xml = (new window.DOMParser()).parseFromString(mapRaw, "text/xml");
							_this.parseMapData(xml);
						}, true);

						reader.readAsText(file[0]);
						otmPortal.terminate(otmPortal);
					} else {
						console.log("Not a XML Map file!");
					}
				}
			},
			
			/* function - loadTileSet
			* -------------------------
			* this function opens a portal that prompts the user to find the image
			* file that holds the tileset that will be used for the map.
			* the application will then generate individual tiles from the image map
			* and populate the tilette with the different sprites.
			*/
			loadTileSet : function(attr) {
				var _this = attr.that;
				var tsPortal = _this.portal.addSubPortal("Load Tileset");
				tsimage = new Image();
				tsPortal.setSize(230, 60);
				tsPortal.setPosition(40, 40);
				tsPortal.setOnClose(true);
				
				var cont = document.getElementById("subportal_container-" + tsPortal.id + "-" + _this.portal.id);
				cont.style.backgroundColor = "#ddd";
				cont.style.width = "100%";
				cont.style.height = "100%";
				cont.parentNode.style.overflow = "hidden";

				var file = document.createElement("input");

				file.setAttribute("type", "file");
				file.setAttribute("id", "tileset_file");
				file.style.marginLeft = "10px";
				file.style.marginTop = "10px";
				file.addEventListener("change", loadFile, false);
				
				cont.appendChild(file);
				
				function loadFile(event) {
					console.log("Loading file!");
					var file = event.target.files;
					var type = file[0].type;
					var fileName = file[0].name;
					
					if(type == "image/png" || 
					   type == "image/gif" || 
					   type == "image/jpg" || 
					   type == "image/jpeg") {
						console.log("Excellent!");
						
						var reader = new FileReader();
						reader.addEventListener("load", function(e) {
							tsimage.src = e.target.result;
							tsimage.addEventListener("load", function(){
								_this.tileset.setImage(tsimage);
								_this.tileset.setFileName(fileName);
								_this.tileset.generateTiles(_this.map.sizeX, _this.map.sizeY);
								_this.updateTilette();
							},true);
						}, true);
						
						reader.readAsDataURL(file[0]);
						tsPortal.terminate(tsPortal);
						return true;
					} else {
						console.log("Not a Image file!");
						return false;
					}
				}
			},
			
			/* function - updateTilette
			* --------------------------
			* this function is used to fetch the individual tiles from the imagemap
			* that have been loaded for the purpose.
			*/
			updateTilette : function() {
				var cont = document.getElementById("subportal_container-" + this.tilette.id + "-" + this.portal.id);
				var child = cont.childNodes[1];
				console.log(this.tileset);
				cont.replaceChild(this.tileset.renderTileSet(), child);
			},

			setActiveTile : function() {
				var prevTile = document.getElementById("tilette_tile_prev");
				var dataId = document.getElementById("");
				prevTile.childNodes[0].src = this.tileset.tiles[this.tileset.active].src;

			},

			setTilefo : function() {
				var tile = this.map.tiles[this.map.activeTile];
				var tileImg = document.getElementById("tile-" + id).childNodes[0];
				var tilefoInput = document.getElementById("tilefo_input");
				var tilefoText = document.getElementById("tilefo_tileinfo");
				var tilefoSprite = document.getElementById("tilefo_sprite");

				tilefoInput.value = tile.data["id"];
				tilefoSprite.innerHTML = '<img src="' + tileImg.src + '" />';
				tilefoText.innerHTML = 'Tile: ' + this.map.activeTile;
			},
			
			toggleSub : function(attr) {
				if(attr.src == "tool") {
					attr.that.toolbar.toggle();
				} else if(attr.src == "tile") {
					attr.that.tilette.toggle();
				} else if(attr.src == "info") {
					attr.that.tilefo.toggle();
				} else {
					attr.that.about.toggle();
				}
			},
			
			setStatusTile : function(id, map) {
				var x, y;
				x = id % map.width;
				y = Math.floor(id / map.width);
				this.portal.setStatus("Tile: " + x + " - " + y);
			},
			
			setMode : function(mode) {
				//console.log("New mode: " + mode);
				this.mode = mode;
				
				var cont = document.getElementById("subportal_container-" + this.toolbar.id + "-" + this.portal.id);
				var buttons = cont.childNodes;
				var btnLen = buttons.length;
				var i, ref;
				
				for(i = 0; i < btnLen; i++) {
					ref = buttons[i].getAttribute("ref");
					buttons[i].setAttribute("class", "tool_btn btn_" + ref);
				}
				
				buttons[mode].setAttribute("class", "tool_btn btn_" + buttons[mode].getAttribute("ref") + " tool_active");
			},
			
			triggerTile : function(id, map) {
				if(this.mode == 0) {
					this.setTilefo(id);
				} else if(this.mode == 1 && this.tileset.image != null) {
					map.setTile(id, this.tileset.active);
					map.setDataId(id, this.tileset.activeId);
				} else if(this.mode == 2) {
					map.clearTile(id);
				}
			},
			
			trackMouseMovement : function(event) {
				var selElem = document.getElementById("select_box-" + this.portal.id);
				if(selElem != undefined && selElem.display == "block") {
					var parent = selElem.parentNode();
					parent.removeChild[selElem];
					selElem.display = "none";
					return;
				}
				if(this.mode != 4) {
					return;
				}
				var _this = this;
				var startX, endX, startY, endY, startMX, startMY;
				var startId = this.map.getActiveTile();
				var endId = this.map.getActiveTile();
				var selElem = WT.dom.createDiv(
					{"id" : "select_box-" + _this.portal.id,
					"class" : "select_box"},
					{"display" : "block",
					"position" : "absolute"}
				);
				var tileCont = document.getElementById("tilemap-Test");
				var startTile = document.getElementById("tile_handle-" + startId);
				tileCont.appendChild(selElem);

				// Need to get a start offset to calculate the amount of tiles that
				// the mouse traverses during the selection!

				startMX = event.clientX - tileCont.offsetLeft;
				startMY = event.clientY - tileCont.offsetTop;

				this.setSelection(startId, endId);
				
				if(selElem.style.display == "none") {
					selElem.style.display = "block";
				}
				
				startX = startId % this.map.width;
				startY = Math.floor(startId / this.map.width);
				
				document.addEventListener("mousemove", moveHandler, true);
				document.addEventListener("mouseup", upHandler, true);
				
				function moveHandler(e) {
					var mX, mY, tileX, tileY;
					mX = e.clientX - startMX;
					mY = e.clientY - startMY;

					tileX = Math.floor(mX / _this.map.sizeX);
					tileY = Math.floor(mY / _this.map.sizeY);

					console.log("End ID: " + (startX + tileX) + ((startY + tileY) * _this.map.width));

					console.log("Active Tile: " + ((startX + tileX) * (startY + tileY)));
					
					endId = _this.map.getActiveTile();
					_this.setSelection(startId, (startX + tileX) + ((startY + tileY) * _this.map.width));
				}
				
				function upHandler(e) {
					document.removeEventListener("mouseup", upHandler, true);
					document.removeEventListener("mousemove", moveHandler, true);
					endX = endId % _this.map.width;
					endY = Math.floor(endId / _this.map.width);

					var mX, mY, tileX, tileY;
					mX = e.clientX - startMX;
					mY = e.clientY - startMY;

					tileX = Math.floor(mX / _this.map.sizeX);
					tileY = Math.floor(mY / _this.map.sizeY);

					_this.setSelection(startId, (startX + tileX) + ((startY + tileY) * _this.map.width));
					e.stopPropagation();
				}
			},

			/* function : setSelection
			 * ---------------------------
			 * This function will take data from some event handler and make a selection
			 * box that fits the metrics from that data
			 * it will take the start and end tile ID and calculate the width, height and
			 * start position of the selection box based on that.
			 */
			
			setSelection : function(start, end) {
				var startX, endX, startY, endY;
				
				startX = start % this.map.width;
				startY = Math.floor(start / this.map.width);
				
				endX = end % this.map.width;
				endY = Math.floor(end / this.map.width);
				endX++;
				endY++;
				
				var selElem = document.getElementById("select_box-" + this.portal.id);
				var cont = document.getElementById("portal-container-" + this.portal.id);
				var startTile = document.getElementById("tile-" + start);
				var endTile = document.getElementById("tile-" + end);
				
				selElem.style.left = (startTile.offsetLeft) + "px";
				selElem.style.width = (this.map.sizeX * (endX - startX) - 2) + "px";
				selElem.style.top = (startTile.offsetTop) + "px";
				selElem.style.height = (this.map.sizeY * (endY - startY) - 2) + "px";
				
				console.log(selElem);
				
				console.log("Selection x: " + startTile.offsetLeft +
						" y: " + startTile.offsetTop +
						" x2: " + this.map.sizeX * (endX - startX) +
						" y2: " + this.map.sizeY * (endY - startY));
				
			},
			
			/*
			* function : saveFile
			* ---------------------
			* Need to make a popup that gives the user input options to choose
			* file title and specify the location of the sprite map.
			* I also need to keep the JSON generation in the main class as I need
			* to fetch info from different instances of the application!
			*/
			saveFile : function(attr) {
				var _this = attr.that;
				var form, data, input, iframe, textarea, iframeDoc, parent;
				var sp = _this.portal.addSubPortal("Save Map As");
				sp.setSize(200, 100);
				sp.setOnClose(true);
				var saveInput = document.createElement("input");
				saveInput.style.position = "absolute";
				saveInput.style.left = "10px";
				saveInput.style.right = "10px";
				saveInput.style.top = "6px";
				saveInput.style.borderStyle = "solid";
				saveInput.style.borderWidth = "1px";
				saveInput.style.borderColor = "#666";

				var saveBtn = WT.dom.createDiv(
					{"id" : "stm_save_btn", "class" : "btn"},
					{"position" : "absolute",
					"left" : "10px",
					"top" : "40px"}
				);
				saveBtn.innerHTML = "Save";
				saveBtn.addEventListener("click", function() {
					console.log("Save map!");
					form = document.createElement("form");
					input = document.createElement("input");
					iframe = document.createElement("iframe");
					data = document.createElement("textarea");
				
					iframe.style.display = "none";
				
					document.body.appendChild(iframe);
					var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				
					form.action = "backend/tm.format.xml.php";
					form.method = "POST";

					data.innerHTML = _this.generateMapData();
					data.setAttribute("name", "data");

					input.setAttribute("name", "title");
					input.value = saveInput.value;
					if(input.value == "") {
						input.value = "Untitled";
					}
				
					form.appendChild(data);
					form.appendChild(input);
				
					(iframeDoc.body || iframeDoc).appendChild(form);
				
					form.submit();
					iframe.addEventListener("load", function() {
						parent = iframe.parentNode;
						parent.removeChild(iframe);
					}, true);
					sp.terminate(sp);
				}, true);

				var cancelBtn = WT.dom.createDiv(
					{"id" : "stm_cancel_btn", "class" : "btn"},
					{"position" : "absolute",
					"right" : "10px",
					"top" : "40px"}
				);
				cancelBtn.innerHTML = "Cancel";

				cancelBtn.addEventListener("click", function() {
					console.log("Cancel save!");
					sp.terminate(sp);
				}, true);

				var cont = document.getElementById("subportal_container-" + sp.id + "-" + _this.portal.id);
				cont.style.backgroundColor = "#ddd";
				cont.style.width = "100%";
				cont.style.height = "100%";
				cont.parentNode.style.overflow = "hidden";

				saveInput.setAttribute("name", "title");
				saveInput.setAttribute("placeholder", "Untitled");

				cont.appendChild(saveInput);
				cont.appendChild(saveBtn);
				cont.appendChild(cancelBtn);
			},
			
			generateMapData : function() {
				var mapObject = new Object();
				mapObject.name = this.map.title;
				mapObject.description = this.map.description;
				mapObject.width = this.map.width;
				mapObject.height = this.map.height;
				mapObject.tile_width = this.map.sizeX;
				mapObject.tile_height = this.map.sizeY;
				mapObject.texture = this.tileset.filename;
				
				mapObject.sprites = new Object();

				for(var i = 0; i < this.tileset.tiles.length; i++) {
					mapObject.sprites[i] = new Object();
					mapObject.sprites[i].id = i;
					mapObject.sprites[i].startx = this.tileset.tileData[i].startX;
					mapObject.sprites[i].starty = this.tileset.tileData[i].startY;
				}

				mapObject.tiles = new Object();

				for(var i = 0; i < this.map.tiles.length; i++) {
					mapObject.tiles[i] = new Object();
					mapObject.tiles[i].id = this.map.tiles[i].id;
				}

				console.log(JSON.stringify(mapObject));

				return JSON.stringify(mapObject);
			},

			/* function - parseMapData
			*--------------------------
			* This function takes the data that is recived after loading a map
			* through the "Open" function. I need to do a couple of things to make
			* this work, first I need to parse the XML file to get all the data needed
			* then I need to write a special function to load the tileset and reload
			* the tile images. And push each tile image to it's tile at the map.
			*/
			parseMapData : function(data) {
				//console.log(data);
				var tilemap, sprites, tiles;
				var width, height, tileWidth, tileHeight, title, description, texture;
				var tile, sprite;

				tilemap = data.getElementsByTagName("tilemap");
				sprites = data.getElementsByTagName("sprites");
				tiles = data.getElementsByTagName("tile");

				width = tilemap[0].getAttribute("width");
				height = tilemap[0].getAttribute("height");
				title = tilemap[0].getAttribute("title");
				description = tilemap[0].getAttribute("description");
				texture = tilemap[0].getAttribute("texture");

				tileWidth = sprites[0].getAttribute("width");
				tileHeight = sprites[0].getAttribute("height");

				var params = new Object();
					
				params.width = width;
				params.height = height;
				params.tileWidth = tileWidth;
				params.tileHeight = tileHeight;
				params.title = title;
				params.description = description;
				this.generateTileMap(params);

				this.tileset = new WT.app.tilemap.TileSet(this);
				this.tileset.fileName = texture;
				this.tileset.sizeX = tileWidth;
				this.tileset.sizeY = tileHeight;

				sprite = new Array();
				for(var i = 0; i < sprites.length; i++) {
					var sX, sY;
					sX = sprites[i].getAttribute("startx");
					sY = sprites[i].getAttribute("starty");
				}

				this.loadTileSet({"that" : this});
				this.tileset.loadMap = true;

				for(var i = 0; i < tiles.length; i++) {
					this.map.tiles[i].id = tiles[i].getAttribute("id");
				}
			},

			loadMap : function() {
				this.map.loadTiles();
			},

			exitApplication : function(attr) {
				var _this = attr.that;
				_this.portal.terminate(_this.portal);
			}
		};
		return tilemap;
	},

	TileMap : function(srcParent, srcWidth, srcHeight, srcSizeX, srcSizeY, srcTitle, srcDesc) {
		var tilemap = {
			parent : srcParent,
			tiles : new Array(),
			width : srcWidth || 32,
			height : srcHeight || 32,
			sizeX : srcSizeX || 32,
			sizeY : srcSizeY || 32,
			title : srcTitle || "Unnamed",
			description : srcDesc || "No description.",
			activeTile : 0,
			
			init : function() {
				var i, size;
				size = this.width * this.height;
				for(i = 0; i < size; i++) {
					this.tiles[i] = new WT.app.tilemap.Tile();
				}
			},
		
			generateDivMap : function() {
				var _this = this;
				var cont = WT.dom.createDiv(
					{"id" : "tilemap-" + this.title,
					"class" : "tilemap_container"},
					{"width" : (this.width * this.sizeX) + "px",
					"height" : (this.height * this.sizeY) + "px"}
				);

				cont.addEventListener("mouseover", function(e) {
					e.preventDefault(); 
					id = e.target.getAttribute("data-id");
					_this.parent.setStatusTile(id, _this);
					_this.activeTile = id;
				}, true);

				cont.addEventListener("click", function(e) {
					e.preventDefault();
					id = e.target.getAttribute("data-id");
					_this.parent.triggerTile(id, _this);
				}, true);
				
				var tileLen = this.tiles.length;
				var i;
				for(i = 0; i < tileLen; i++) {
					cont.appendChild(this.generateDivTile(i));
				}
				return cont;
			},
			
			generateDivTile : function(id) {
				var _this = this;
				var tile = WT.dom.createDiv(
					{"id" : "tile-" + id,
					"class" : "tile",
					"data-id" : id},
					{"width" : (this.sizeX) + "px",
					"height" : (this.sizeY)+ "px"}
				);
				
				var tileHandle = WT.dom.createDiv(
					{"id" : "tile_handle-" + id,
					"class" : "tile_handle",
					"data-id" : id},
					{"width" : (this.sizeX) + "px",
					"height" : (this.sizeY)+ "px"}
				);
				
				var tileImg = document.createElement("img");
				//tileImg.draggable = "false";
				tileImg.setAttribute("src", WT.data.BLANK_IMG);
				tileImg.setAttribute("class", "tile_img");
				
				//tile.draggable = "false";
				//tileHandle.draggable = "false";
				tile.appendChild(tileImg);
				tile.appendChild(tileHandle);
				
				return tile;
			},
			
			setTile : function(id, tileId) {
				console.log("Setting tile: " + id + " with tile: " + tileId);
				this.tiles[id].id = tileId;
				var tile = document.getElementById("tile-" + id);
				var img = tile.childNodes[0];
				img.src = this.parent.tileset.tiles[tileId].src;
			},

			setDataId : function(id, dataId) {
				this.tiles[id].data["id"] = id;
			},
			
			clearTile : function(id) {
				console.log("Clearing tile: " + id);
				var tile = document.getElementById("tile-" + id);
				var img = tile.childNodes[0];
				img.src = WT.data.BLANK_IMG;
			},
			
			getActiveTile : function() {
				return this.activeTile;
			},

			loadTiles : function() {
				for(var i = 0; i < this.tiles.length; i++) {
					this.setTile(i, this.tiles[i].id);
				}
			}
		};
		return tilemap;
	},
	
	Tile : function() {
		var tile = {
			id : 0,
			data : new Object()
		};
		return tile;
	},
	
	/*-----------------
	 * Class - TileSet
	 * ----------------
	 * This class will handle the tileset that is used when creating tilemaps.
	 * this class will also handle the upload procedure as well as future editing features
	 * when it comes to tilesets.
	 */
	TileSet : function(srcParent) {
		var tileset = {
			parent : srcParent,
			image : null,
			filename : "",
			tiles : new Array(),
			tileData : new Array(),
			sizeX : 0,
			sizeY : 0,
			tilesX : 0,
			tilesY : 0,
			active : 0,
			activeId : 0,
			ready : false,
			loadMap : false,
			
			setImage : function(image) {
				this.image = image;
			},

			setFileName : function(fn) {
				this.filename = fn;
			},

			loadTileset : function() {
				var _this = this;
				this.image.src = this.filename;
				this.image.addEventListener("load", function() {
					_this.generateTiles(_this.sizeX, _this.sizeY);
				});
			},
			
			generateTiles : function(sizeX, sizeY) {
				var xTiles, yTiles, numTiles, i, x, y;
				this.sizeX = sizeX;
				this.sizeY = sizeY;
				this.tilesX = this.image.width / sizeX;
				this.tilesY = this.image.height / sizeY;
				numTiles = this.tilesX * this.tilesY;
				for(i = 0; i < numTiles; i++) {
					x = (i % this.tilesX) * sizeX;
					y = Math.floor(i / this.tilesX) * sizeY;
					this.tileData[i] = new Object();
					this.tileData[i].startX = x;
					this.tileData[i].startY = y;
					console.log("Test 4");
					this.tiles[i] = new Image();
					this.tiles[i].src = this.generateTile(sizeX, sizeY, x, y);
				}
				this.ready = true;
				if(this.loadMap) {
					this.parent.loadMap();
				}
			},
			
			generateTile : function(sizeX, sizeY, x, y) {
				console.log("Generating Tile Image Data!");
				var canvas, context;
				canvas = document.createElement("canvas");
				canvas.width = sizeX;
				canvas.height = sizeY;
				
				context = canvas.getContext("2d");
				context.drawImage(this.image, -x, -y);
				
				return canvas.toDataURL();
			},
			
			renderTileSet : function() {
				var _this = this;
				var tempImg, tileCont, tileHandle, i, tileLen;
				var cont = document.getElementById("tilette");
				tileLen = this.tiles.length;
				
				for(i = 0; i < tileLen; i++) {
					var id = i;
					tileCont = WT.dom.createDiv(
						{"id" : "tile_container-" + id,
						"class" : "tilette_tile_container"},
						{"width" : this.sizeX + "px",
						"height" : this.sizeY + "px"}
					);

					tileHandle = WT.dom.createDiv(
						{"id" : "tile_handle-" + id,
						"class" : "tilette_tile_handle"}
					);
					
					var tileHandle = document.createElement("div");
					tileHandle.setAttribute("id", "tile_handle-" + id);
					tileHandle.setAttribute("class", "tilette_tile_handle");
					tileHandle.setAttribute("ref", id);
					tileHandle.addEventListener("click", function(event) { _this.setActive(event); }, false);
					
					tempImg = document.createElement("img");
					tempImg.setAttribute("class", "tilette_tile");
					tempImg.src = this.tiles[i].src;
					
					tileCont.appendChild(tempImg);
					tileCont.appendChild(tileHandle);
					cont.appendChild(tileCont);
				}
				return cont;
			},
			
			setActive : function(event) {
				var id = event.target.getAttribute("ref");
				console.log("New tile ID: " + id);
				this.active = id;
				this.parent.setActiveTile();
			}
		};
		return tileset;
	}
};