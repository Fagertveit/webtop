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
			portal : null,
			icon : null,
			title : null,
			tileset : null,
			documents : new Array(),
			mode : 0,
			
			init : function() {
				this.portal = this.parent.addPortal("Tilemap Editor 0.1", 600, 400);
				this.initMenu();
				this.initSubs();
				this.initTileMap();
				this.tileset = new WT.app.tilemap.TileSet(this);
				this.setMode(1);
			},
			
			initTileMap : function() {
				var container = document.getElementById("portal_container-" + this.portal.id);
				var tilemap = new WT.app.tilemap.TileMap(this, 32, 32, 32, 32, "Test");
				tilemap.init();
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
				this.tilefo.setSize(200, 100);
				this.tilefo.setPosition(350, 50);
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
				var cont = document.getElementById("subportal_container-" + this.tilette.id + "-" + this.portal.id);
				var tileCont = WT.dom.createDiv(
					{"id" : "tilette",
					"class" : "tilette"}
				);
				cont.appendChild(tileCont);
			},
			
			initTilefo : function() {
				// Tile GFX
				// Tile Position
				// Tile Data
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
				this.portal.addMenuItem("File", "Open");
				this.portal.addMenuItem("File", "Save", _this.saveFile);
				this.portal.menu.menus["File"].items["Save"].setAttributes({"that" : _this});
				this.portal.menu.menus["File"].addDelimiter();
				this.portal.addMenuItem("File", "Exit");
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
				this.portal.addMenuItem("Help", "About");
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
				ntmPortal.setSize(200, 200);
				ntmPortal.setPosition(40, 40);
				ntmPortal.setOnClose(true);
				
				var cont = document.getElementById("subportal_container-" + ntmPortal.id + "-" + _this.portal.id);
				/*
				var name = document.createElement("input");
				var desc = document.createElement("textarea");
				var type = document.createElement("select");
				var dataType = document.createElement("select");
				var width = document.createElement("input");
				var height = document.createElement("input");
				var tileWidth = document.createElement("input");
				var tileHeight = document.createElement("input");
				*/
				var name = WT.dom.createFormElement("input", 
					{"name" : "name", "id" : "ntm_name", "class" : "medium_input"}
				);
				var desc = WT.dom.createFormElement("textarea", 
					{"name" : "description", "id" : "ntm_desc", "class" : "medium_input"}
				);
				var type = WT.dom.createFormElement("select", 
					{"name" : "type", "id" : "ntm_type"},
					{"rectangular" : "Rectangular", "hexagonal" : "Hexagonal", "isometric" : "Isometric"}
				);
				var dataType = WT.dom.createFormElement("select", 
					{"name" : "data_type", "id" : "ntm_data_type"},
					{"default" : "Default", "2" : "2 Datafields"}
				);
				var width = WT.dom.createFormElement("input", 
						{"name" : "width", "id" : "ntm_width", "class" : "small_input"}
				);
				var height = WT.dom.createFormElement("input", 
					{"name" : "height", "id" : "ntm_height", "class" : "small_input"}
				);
				var tileWidth = WT.dom.createFormElement("input", 
					{"name" : "tile_width", "id" : "ntm_tile_width", "class" : "small_input"}
				);
				var tileHeight = WT.dom.createFormElement("input", 
					{"name" : "tile_height", "id" : "ntm_tile_height", "class" : "small_input"}
				);
				
				cont.appendChild(name);
				cont.appendChild(desc);
				cont.appendChild(type);
				cont.appendChild(dataType);
				cont.appendChild(width);
				cont.appendChild(height);
				cont.appendChild(tileWidth);
				cont.appendChild(tileHeight);
			},
			
			loadTileSet : function(attr) {
				var _this = attr.that;
				var tsPortal = _this.portal.addSubPortal("Load Tileset");
				tsimage = new Image();
				tsPortal.setSize(300, 300);
				tsPortal.setPosition(40, 40);
				tsPortal.setOnClose(true);
				
				var cont = document.getElementById("subportal_container-" + tsPortal.id + "-" + _this.portal.id);
				var file = document.createElement("input");
				var out = WT.dom.createDiv(
					{"id" : "tileset_output",
					"class" : "tileset_output"}
				);
				file.setAttribute("type", "file");
				file.setAttribute("id", "tileset_file");
				file.addEventListener("change", loadFile, false);
				
				cont.appendChild(file);
				cont.appendChild(out);
				
				function loadFile(event) {
					console.log("Loading file!");
					var file = event.target.files;
					var type = file[0].type;
					
					if(type == "image/png" || 
					   type == "image/gif" || 
					   type == "image/jpg" || 
					   type == "image/jpeg") {
						console.log("Excellent!");
						
						var reader = new FileReader();
						reader.addEventListener("load", function(e) {
							tsimage.src = e.target.result;
							tsimage.addEventListener("load", function(){_this.tileset.setImage(tsimage); _this.tileset.generateTiles(32, 32); _this.updateTilette();},true);
							out.innerHTML = '<img src="' + e.target.result + '" />';
							
						}, true);
						
						reader.readAsDataURL(file[0]);
					} else {
						console.log("Not a Image file!");
					}
				}
			},
			
			updateTilette : function() {
				var cont = document.getElementById("subportal_container-" + this.tilette.id + "-" + this.portal.id);
				var child = cont.childNodes[0];
				console.log(this.tileset);
				cont.replaceChild(this.tileset.renderTileSet(), child);
			},
			
			toggleSub : function(attr) {
				if(attr.src == "tool") {
					attr.that.toolbar.toggle();
				} else if(attr.src == "tile") {
					attr.that.tilette.toggle();
				} else {
					attr.that.tilefo.toggle();
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
				if(this.mode == 1 && this.tileset.image != null) {
					map.setTile(id, this.tileset.active);
				}
			},
			
			saveFile : function(attr) {
				var form, iframe, textarea, iframeDoc, parent;
				
				form = document.createElement("form");
				iframe = document.createElement("iframe");
				input = document.createElement("input");
				
				iframe.style.display = "none";
				
				document.body.appendChild(iframe);
				var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				
				form.action = "backend/tm.format.xml.php";
				form.method = "POST";
				
				input.value = "testing";
				input.name = "title";
				
				form.appendChild(input);
				
				(iframeDoc.body || iframeDoc).appendChild(form);
				
				form.submit();
				iframe.addEventListener("load", function() {
					parent = iframe.parentNode;
					parent.removeChild(iframe);
				}, true);
			},
			
			fileSaved : function(xhr) {
				console.log("File Saved!");
				console.log(xhr.responseText);
			}
		};
		return tilemap;
	},

	TileMap : function(srcParent, srcWidth, srcHeight, srcSizeX, srcSizeY, srcTitle) {
		var tilemap = {
			parent : srcParent,
			tiles : new Array(),
			width : srcWidth || 32,
			height : srcHeight || 32,
			sizeX : srcSizeX || 32,
			sizeY : srcSizeY || 32,
			title : srcTitle || "Unnamed",
			
			init : function() {
				var i, size;
				size = this.width * this.height;
				for(i = 0; i < size; i++) {
					this.tiles[i] = new WT.app.tilemap.Tile();
				}
			},
		
			generateDivMap : function() {
				var cont = WT.dom.createDiv(
					{"id" : "tilemap-" + this.title,
					"class" : "tilemap_container"},
					{"width" : (this.width * this.sizeX) + "px",
					"height" : (this.height * this.sizeY) + "px"}
				);
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
					"class" : "tile"},
					{"width" : (this.sizeX) + "px",
					"height" : (this.sizeY)+ "px"}
				);
				
				var tileHandle = WT.dom.createDiv(
					{"id" : "tile_handle-" + id,
					"class" : "tile_handle"},
					{"width" : (this.sizeX) + "px",
					"height" : (this.sizeY)+ "px"}
				);
				
				var tileImg = document.createElement("img");
				tileImg.setAttribute("src", "");
				tileImg.setAttribute("class", "tile_img");
				
				tile.appendChild(tileImg);
				tile.appendChild(tileHandle);
				
				tileHandle.addEventListener("mouseover", function() {_this.parent.setStatusTile(id, _this);}, true);
				tileHandle.addEventListener("click", function() {_this.parent.triggerTile(id, _this);}, true);
				return tile;
			},
			
			setTile : function(id, tileId) {
				console.log("Setting tile: " + id + " with tile: " + tileId);
				var tile = document.getElementById("tile-" + id);
				var img = tile.childNodes[0];
				img.src = this.parent.tileset.tiles[tileId].src;
			}
		};
		return tilemap;
	},
	
	Tile : function() {
		var tile = {
			id : 0,
			data : new Object(),
			
			init : function() {
				
			},
		
			generateDiv : function() {
				/*
				var _this = this;
				var tile = WT.dom.createDiv(
					{"id" : "tile-" + id,
					"class" : "tile"},
					{"width" : (this.sizeX - 1) + "px",
					"height" : (this.sizeY - 1)+ "px",
					"backgroundImage" : "url('../webtop/img/open01.png')"}
				);
				
				tile.addEventListener("mouseover", function() {_this.parent.setStatusTile(id);},true);
				return tile;
				*/
			}
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
			tiles : new Array(),
			sizeX : 0,
			sizeY : 0,
			active : 0,
			
			setImage : function(image) {
				this.image = image;
			},
			
			generateTiles : function(sizeX, sizeY) {
				var xTiles, yTiles, numTiles, i, x, y;
				this.sizeX = sizeX;
				this.sizeY = sizeY;
				xTiles = this.image.width / sizeX;
				yTiles = this.image.height / sizeY;
				numTiles = xTiles * yTiles;
				
				for(i = 0; i < numTiles; i++) {
					x = (i % xTiles) * sizeX;
					y = Math.floor(i / xTiles) * sizeY;
					this.tiles[i] = new Image();
					this.tiles[i].src = this.generateTile(sizeX, sizeY, x, y);
				}
			},
			
			generateTile : function(sizeX, sizeY, x, y) {
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
				var cont = WT.dom.createDiv(
					{"id" : "tilette",
					"class" : "tilette"}
				);
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
			}
		};
		return tileset;
	}
};