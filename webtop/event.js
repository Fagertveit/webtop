WT.event = {
	MOUSEX : 0,
	MOUSEY : 0,
	MB_DOWN : false,
	MB_CLICK : false,
	COOLDOWN : 0,

	KEYS : new Array(256),

	STOP_DEFAULT_KEY_EVENT : true,
	STOP_DEFAULT_MOUSE_EVENT : false,

	initKeys : function() {
		for ( var i = 0; i < CGL.event.KEYS.length; i++) {
			CGL.event.KEYS[i] = false;
		}
	},

	initMouseHandler : function() {
		window.addEventListener("mousemove", CGL.event.handleMouseMovement, false);
		window.addEventListener("mousedown", CGL.event.handleMouseDown, false);
		window.addEventListener("mouseup", CGL.event.handleMouseUp, false);
		window.addEventListener("click", CGL.event.handleMouseClick, false);
	},

	initKeyHandler : function() {
		window.addEventListener("keydown", CGL.event.handleKeyDown, false);
		window.addEventListener("keyup", CGL.event.handleKeyUp, false);
	},

	initEventHandler : function() {
		WT.event.initMouseHandler();
		WT.event.initKeyHandler();
	},

	handleMouseMovement : function(e) {
		CGL.event.getCursorPosition(e);
	},

	handleMouseDown : function(e) {
		if (WT.event.STOP_DEFAULT_MOUSE_EVENT) {
			e.stopPropagation();
			e.preventDefault();
		}
		WT.event.MB_DOWN = true;
	},

	handleMouseUp : function(e) {
		if (WT.event.STOP_DEFAULT_MOUSE_EVENT) {
			e.stopPropagation();
			e.preventDefault();
		}
		WT.event.MB_DOWN = false;
	},

	handleMouseClick : function(e) {
		if (WT.event.STOP_DEFAULT_MOUSE_EVENT) {
			e.stopPropagation();
			e.preventDefault();
		}
		WT.event.MB_CLICK = true;
	},

	handleKeyDown : function(e) {
		if (CGL.event.STOP_DEFAULT_KEY_EVENT) {
			e.stopPropagation();
			e.preventDefault();
		}
		CGL.event.KEYS[e.keyCode] = true;
		CGL.util.printLn("Key pressed: " + e.keyCode);
	},

	handleKeyUp : function(e) {
		if (CGL.event.STOP_DEFAULT_KEY_EVENT) {
			e.stopPropagation();
			e.preventDefault();
		}
		CGL.event.KEYS[e.keyCode] = false;
		CGL.util.printLn("Key released: " + e.keyCode);
	},

	getCursorPosition : function(e) {
		if (e.pageX != undefined && e.pageY != undefined) {
			CGL.event.MOUSEX = e.pageX;
			CGL.event.MOUSEY = e.pageY;
		} else {
			CGL.event.MOUSEX = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
			CGL.event.MOUSEY = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
		}

		CGL.event.MOUSEX -= document
				.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).offsetLeft;
		CGL.event.MOUSEY -= document
				.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).offsetTop;
	}
};