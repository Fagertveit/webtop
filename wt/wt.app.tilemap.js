WT.app.tilemap = {
	App : function(srcParent) {
		var tilemap = {
			parent : srcParent,
			toolbar : null,
			tilette : null,
			portal : null,
			icon : null,
			title : null,
			documents : new Array(),
			
			init : function() {
				this.portal = this.parent.addPortal("Tilemap Editor 0.1", 600, 400);
				this.initMenu();
				this.initSubs();
				this.initTileMap();
			},
			
			initTileMap : function() {
				var container = document.getElementById("portal_container-" + this.portal.id);
				var tilemap = new WT.app.tilemap.TileMap(32, 32, 32, 32, "Test");
				tilemap.init();
				container.appendChild(tilemap.generateDivMap());
			},
			
			initSubs : function() {
				this.toolbar = this.portal.addSubPortal("Toolbar");
				this.toolbar.setWidth(80);
				this.toolbar.setHeight(160);
				this.toolbar.setPosition(50, 90);
				this.tilette = this.portal.addSubPortal("Tilette");
				this.tilette.setWidth(200);
				this.tilette.setHeight(200);
				this.tilette.setPosition(350, 70);
			},
		
			initMenu : function() {
				var _this = this;
				this.portal.addMenuBar();
				this.portal.addMenu("File");
				this.portal.addMenu("Edit");
				this.portal.addMenu("Tileset");
				this.portal.addMenu("View");
				this.portal.addMenu("Help");
				this.portal.addMenuItem("File", "New");
				this.portal.addMenuItem("File", "Open");
				this.portal.addMenuItem("File", "Save");
				this.portal.menu.menus["File"].addDelimiter();
				this.portal.addMenuItem("File", "Exit");
				this.portal.addMenuItem("Edit", "Copy");
				this.portal.addMenuItem("Edit", "Paste");
				this.portal.addMenuItem("Edit", "Clear");
				this.portal.menu.menus["Edit"].addDelimiter();
				this.portal.addMenuItem("Edit", "Settings");
				this.portal.addMenuItem("Tileset", "Load");
				this.portal.addMenuItem("Tileset", "Edit");
				this.portal.addMenuItem("View", "Toolbar", _this.toggleSub);
				this.portal.menu.menus["View"].items["Toolbar"].setAttributes({"src" : "tool", "that" : _this});
				this.portal.addMenuItem("View", "Tilette", _this.toggleSub);
				this.portal.menu.menus["View"].items["Tilette"].setAttributes({"src" : "tile", "that" : _this});
				this.portal.addMenuItem("Help", "About");
			},
			
			toggleSub : function(attr) {
				if(attr.src == "tool") {
					attr.that.toolbar.toggle();
				} else {
					attr.that.tilette.toggle();
				}
			}
		};
		return tilemap;
	},

	TileMap : function(srcWidth, srcHeight, srcSizeX, srcSizeY, srcTitle) {
		var tilemap = {
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
				var tile = WT.dom.createDiv(
					{"id" : "tile-" + id,
					"class" : "tile"},
					{"width" : (this.sizeX - 1) + "px",
					"height" : (this.sizeY - 1)+ "px"}
				);
				return tile;
			}
		};
		return tilemap;
	},
	
	Tile : function() {
		var tile = {
			id : 0,
			data : new Object(),
			
			init : function() {
				
			}
		};
		return tile;
	}
};