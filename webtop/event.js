WT.event = {
	move : function(element, event) {
		var startX = event.clientX;
		var startY = event.clientY;
		
		var origX = element.offsetLeft;
		var origY = element.offsetTop;
		
		var deltaX = startX - origX;
		var deltaY = startY - origY;
		
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
		
		event.stopPropagation();
		event.preventDefault();
		
		function moveHandler(e) {
			element.style.left = (e.clientX - deltaX) + "px";
			element.style.top = (e.clientY - deltaY) + "px";
			e.stopPropagation();
		}
		
		function upHandler(e) {
			document.removeEventListener("mouseup", upHandler, true);
			document.removeEventListener("mousemove", moveHandler, true);
			e.stopPropagation();
		}
	},

	resize : function(element, event) {
		var startX = event.clientX;
		var startY = event.clientY;
		
		var origX = element.offsetLeft;
		var origY = element.offsetTop;
		
		var deltaX = startX - origX;
		var deltaY = startY - origY;
		
		var startWidth = element.style.width;
		startWidth = Number(startWidth.substr(0, startWidth.length - 2));
		var startHeight = element.style.height;
		startHeight = Number(startHeight.substr(0, startHeight.length - 2));
		
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
		
		event.stopPropagation();
		event.preventDefault();
		
		function moveHandler(e) {
			width = e.clientX - deltaX - origX + startWidth;
			height = e.clientY - deltaY - origY + startHeight;
			if(width > 70) {
				element.style.width = width + "px";
			} else {
				element.style.width = 70 + "px";
			}
			
			if(height > 70) {
				element.style.height = height + "px";
			} else {
				element.style.height = 70 + "px";
			}
			
			e.stopPropagation();
			//console.log("Width: " + (e.clientX - startWidth));
		}
		
		function upHandler(e) {
			document.removeEventListener("mouseup", upHandler, true);
			document.removeEventListener("mousemove", moveHandler, true);
			e.stopPropagation();
		}
	}
};