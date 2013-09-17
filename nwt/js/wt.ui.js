/* * * * * * *
 * Core - UI *
 * * * * * * *
 * This class handles all the usual UI elements that an application might need.
 * this is things like buttons, checkboxes, selection dropboxes and input fields.
 */

WT.ui = {
	/* * * * * * * *
	 * UI - Label  *
	 * * * * * * * *
	 * The UI Label element can be used as a general purpose div element, you can fill it with
	 * text, or a image object, and give it custom CSS rules so that your layout stays the way
	 * you want it to.
	 */
	Label : function(params) {
		var label = {
			text : "No Label",
			parent : {},
			container : {},
			css : {
				label: "wt-label",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass(this.css['label'])
					.html(this.text);

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				this.parent.append(this.container);
			},

			click_handler : function(e) {
				console.log(this.container);
				this.container.trigger("wt:click");
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e);});
			}
		};
		label.constructor(params);

		return label;
	},

	/* * * * * * * *
	 * UI - Button *
	 * * * * * * * *
	 * The Button element will work just as you want it to, it listens for
	 * clicks and hover events and let's you control it's actions.
	 */
	Button : function(params) {
		var button = {
			title : "Untitled",
			application : {},
			parent : {},
			container : {},
			css : {
				button: "wt-button",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass(this.css['button'])
					.html(this.title);

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				this.parent.append(this.container);
			},

			click_handle : function(e) {
				this.container.trigger("wt:click");
			},

			mouseover_handle : function(e) {
				this.container.trigger("wt:mouseover");
			},

			mouseout_handle : function(e) {
				this.container.trigger("wt:mouseout");
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handle(e);})
					.on("mouseover", function(e){_this.mouseover_handle(e);})
					.on("mouseout", function(e){_this.mouseout_handle(e);})
			}
		};
		button.constructor(params);

		return button;
	},

	RadioGroup : function(params) {
		var radioGroup = {
			uid: 0,
			active: -1,
			options: {},
			onchange: {},
			owner: {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addOption : function(option) {
				this.options[this.uid] = option;
				this.options[this.uid].setId(this.uid);
				this.options[this.uid].setGroup(this);

				this.uid += 1;
			},

			removeOption : function(i) {
				this.options[i].deconstruct();
				delete this.options[i];
			},

			change_handler : function(id) {
				if(id == this.active) {
					return 0;
				}

				for(option in this.options) {
					this.options[option].setState(false);
				}

				this.options[id].setState(true);
				this.active = id;
				if(typeof(this.onchange) == "function") {
					this.onchange(this.owner);
				}
			},
		};
		radioGroup.constructor(params);

		return radioGroup;
	},

	RadioButton : function(params) {
		var radioButton = {
			title: "",
			state: false,
			id: 0,
			container: {},
			parent: {},
			group: {},
			onselect: {},
			css: {
				radioButton: "wt-radio-button",
				inset: "inset",
				checked: "checked",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass(this.css['radioButton']);

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				var inset = $("<div>")
					.addClass(this.css['inset'])

				this.container.append(inset);

				this.parent.append(this.container);
			},

			setGroup : function(group) {
				this.group = group;
			},

			getGroup : function() {
				return this.group;
			},

			setId : function(id) {
				this.id = id;
			},

			getId : function() {
				return this.id;
			},

			setState : function(state) {
				this.state = state;
				if(this.state) {
					this.container.addClass(this.css['checked']);
					if(typeof(this.onselect) == "function") {
						this.onselect();
					}
				} else {
					this.container.removeClass(this.css['checked']);
				}
			},

			getState : function() {
				return this.state;
			},

			click_handler : function(e) {
				this.group.change_handler(this.id);
			},

			deconstruct : function() {

			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e);});
			}
		};
		radioButton.constructor(params);

		return radioButton;
	},

	CheckBox : function(params) {
		var checkBox = {
			title: "",
			state: false,
			parent: {},
			container: {},
			onchange: {},
			css: {
				checkBox: "wt-checkbox",
				checked: "checked",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass(this.css['checkBox'])
					.html("X");

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				this.parent.append(this.container);
			},

			setState : function(state) {
				this.state = state;
			},

			getState : function() {
				return this.state;
			},

			changeState : function() {
				this.state = !this.state;
				if(this.state) {
					this.container.addClass(this.css['checked']);
				} else {
					this.container.removeClass(this.css['checked']);
				}

				if(typeof(_this.onchange) == "function") {
					_this.onchange();
				}
			},

			click_handler : function(e) {
				this.changeState();
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e);})
					.on("wt:change", function(e){_this.changeState();})
					.on("wt:state", function(e){_this.getState();});
			}
		};
		checkBox.constructor(params);

		return checkBox;
	},

	SelectBox : function(params) {
		var selectBox = {
			title: "",
			onchange: {},
			options: {},
			css: {
				container: "wt-select-box",
				label: "wt-select-label",
				button: "wt-select-button",
				listBox: "wt-select-list",
				listItem: "wt-select-option",
				selected: "selected",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}
			},

			addEventListeners : function() {

			}
		};
		selectBox.constructor(params);

		return selectBox;
	},

	FileInput : function(params) {
		var fileInput = {
			title: "",
			onchange: {},
			css: {
				container: "wt-file",
				input: "wt-file-input",
				button: "wt-file-button",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				
				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}
			},

			addEventListeners : function() {

			}
		};
		fileInput.constructor(params);

		return fileInput;
	},

	Input : function(params) {
		var input = {
			title: "",
			name: "",
			type: "text",
			width: 24,
			parent: {},
			container: {},
			css: {
				input: "wt-input",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<input>")
					.addClass(this.css['input'])
					.attr("name", this.name)
					.attr("type", this.type)
					.css({
						width: this.width
					});

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				this.parent.append(this.container);
			},

			setValue : function(value) {
				this.container.val(value);
			},

			getValue : function() {
				return this.container.val();
			},

			change_handler : function(e) {
				this.container.trigger("wt:change");
			},

			focus_handler : function(e) {
				this.container.trigger("wt:focus");
			},

			blur_handler : function(e) {
				this.container.trigger("wt:blur");
			},

			keydown_handler : function(e) {
				this.container.trigger("wt:keydown", {evt: e});
			},

			keyup_handler : function(e) {
				this.container.trigger("wt:keyup", {evt: e});
			},

			select_handler : function(e) {
				this.container.trigger("wt:select");
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("change", function(e){_this.change_handler(e);})
					.on("focus", function(e){_this.focus_handler(e);})
					.on("blur", function(e){_this.blur_handler(e);})
					.on("keydown", function(e){_this.keydown_handler(e);})
					.on("keyup", function(e){_this.keyup_handler(e);})
					.on("select", function(e){_this.select_handler(e);});
			}
		};
		input.constructor(params);

		return input;
	},

	TextArea : function(params) {
		var textArea = {
			title: "",
			width: 24,
			height: 12,
			onchange: {},
			onenter: {},
			onfocus: {},
			onblur: {},
			css: {
				textarea: "wt-textarea"
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.addEventListeners();
			},

			generate : function() {
				
			},

			addEventListeners : function() {

			}
		};
		textArea.constructor(params);

		return textArea;
	}
};

WTLabel = WT.ui.Label;
WTButton = WT.ui.Button;
WTRadioGroup = WT.ui.RadioGroup;
WTRadioButton = WT.ui.RadioButton;
WTCheckBox = WT.ui.CheckBox;
WTSelectBox = WT.ui.SelectBox;
WTFileInput = WT.ui.FileInput;
WTInput = WT.ui.Input;
WTTextArea = WT.ui.TextArea;