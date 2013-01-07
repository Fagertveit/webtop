WT.dom = {
	createDiv : function(attributes, styles) {
		var elem = document.createElement("div");
		var attrLen = attributes.length;
		var styleLen = styles != undefined ? styles.length : 0;
		var style = "";
		
		for(var key in attributes) {
			elem.setAttribute(key, attributes[key]);
		}
		
		if(styleLen != 0) {
			for(var key in styles) {
				elem.style[key] = styles[key];
			}
		}
		
		return elem;
	},

	createFormElement : function(type, attributes, options) {
		var elem = document.createElement(type);
		
		for(var key in attributes) {
			elem.setAttribute(key, attributes[key]);
		}

		if(options != undefined) {
			for(var key in options) {
				var option = document.createElement("option");
				option.setAttribute("value", key);
				option.innerHTML = options[key];
				elem.appendChild(option);
			}
		}
		
		return elem;
	}
};