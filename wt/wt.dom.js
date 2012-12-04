WT.dom = {
	createDiv : function(attributes, styles) {
		var elem = document.createElement("div");
		var attrLen = attributes.length;
		var styleLen = styles.length;
		var style = "";
		
		for(var key in attributes) {
			elem.setAttribute(key, attributes[key]);
		}
		
		for(var key in styles) {
			elem.style[key] = styles[key];
		}
		
		return elem;
	}
};