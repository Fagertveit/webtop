WT.ui.slider = {
	Slider : function(params) {
		var slider = {
			realValue: 0.0,
			value: 0,
			max: 100,
			min: 0,
			range: 1,
			container: {},
			handle: {},
			handleMargin: {
				x: 0,
				y: 0
			},
			onchange: {},
			pos: {
				x: 0,
				y: 0
			},
			direction: "horizontal",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.handle.css({
					left: (this.pos.x + this.handleMargin.x),
					top: (this.pos.y + this.handleMargin.y)
				});
				this.addEventListeners();
			},

			calcValue : function() {
				if(this.direction == "horizontal") {
					if(this.pos.x != 0) {
						this.realValue = this.pos.x / this.container.width();
					} else {
						this.realValue = 0;
					}
				} else {
					if(this.pos.y != 0) {
						this.realValue = this.pos.y / this.container.height();
					} else {
						this.realValue = 0;
					}
				}

				this.value = Math.ceil(this.realValue * this.max);
			},

			calcPos : function() {
				if(this.direction == "horizontal") {
					this.pos.x = this.container.width() * this.realValue;
					this.handle.css({
						left: this.pos.x + this.handleMargin.x
					});
				} else {
					this.pos.y = this.container.height() * this.realValue;
					this.handle.css({
						top: this.pos.y + this.handleMargin.y
					});
				}
			},

			setValue : function(value) {
				this.value = value;
				this.realValue = value / this.max;
				this.calcPos();
			},

			getValue : function() {
				return this.value;
			},

			click_handler : function(e, _this) {
				var x = e.clientX;
				var y = e.clientY;

				var originX = this.container.offset().left;
				var originY = this.container.offset().top;

				var newX = ((x - originX) + (this.handleMargin.x));
				var newY = ((y - originY) + (this.handleMargin.y));

				if(_this.direction == "horizontal") {
					if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
						if(newX > (_this.container.width() + _this.handleMargin.x)) {
							newX = (_this.container.width() + _this.handleMargin.x);
						} else if(newX < (0 + this.handleMargin.x)) {
							newX = (0 + _this.handleMargin.x);
						}
					}

					_this.handle.css({
						left: newX
					});
					_this.pos.x = newX - this.handleMargin.x;
				} else {
					if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
						if(newY > (_this.container.height() + _this.handleMargin.y)) {
							newY = (_this.container.height() + _this.handleMargin.y);
						} else if(newY < (0 + _this.handleMargin.y)) {
							newY = (0 + _this.handleMargin.y);
						}
					}

					_this.handle.css({
						top: newY
					});
					_this.pos.y = newY - this.handleMargin.y;
				}

				
				_this.calcValue();
				_this.container.trigger("wt:change");
			},

			mousedown_handler : function(e, _this) {
				var x = e.clientX;
				var y = e.clientY;

				var originX = _this.container.offset().left;
				var originY = _this.container.offset().top;

				var dX = x - originX;
				var dY = y - originY;

				$(document).on("mousemove.slide-move", function(event) {
					var currX = event.clientX;
					var currY = event.clientY;

					var newX = ((currX - originX) + (_this.handleMargin.x));
					var newY = ((currY - originY) + (_this.handleMargin.y));

					if(_this.direction == "horizontal") {
						if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
							if(newX > (_this.container.width() + _this.handleMargin.x)) {
								newX = (_this.container.width() + _this.handleMargin.x);
							} else if(newX < (0 + _this.handleMargin.x)) {
								newX = (0 + _this.handleMargin.x);
							}
						}

						_this.handle.css({
							left: newX
						});
						_this.pos.x = newX - _this.handleMargin.x;
					} else {
						if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
							if(newY > (_this.container.height() + _this.handleMargin.y)) {
								newY = (_this.container.height() + _this.handleMargin.y);
							} else if(newY < (0 + _this.handleMargin.y)) {
								newY = (0 + _this.handleMargin.y);
							}
						}

						_this.handle.css({
							top: newY
						});
						_this.pos.y = newY - _this.handleMargin.y;
					}

					_this.calcValue();
					_this.container.trigger("wt:change");
				});

				$(document).on("mouseup.slide-move", function(event) {
					var currX = event.clientX;
					var currY = event.clientY;

					var newX = ((currX - originX) + (_this.handleMargin.x));
					var newY = ((currY - originY) + (_this.handleMargin.y));

					if(_this.direction == "horizontal") {
						if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
							if(newX > (_this.container.width() + _this.handleMargin.x)) {
								newX = (_this.container.width() + _this.handleMargin.x);
							} else if(newX < (0 + _this.handleMargin.x)) {
								newX = (0 + _this.handleMargin.x);
							}
						}

						_this.handle.css({
							left: newX
						});
						_this.pos.x = newX - _this.handleMargin.x;
					} else {
						if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
							if(newY > (_this.container.height() + _this.handleMargin.y)) {
								newY = (_this.container.height() + _this.handleMargin.y);
							} else if(newY < (0 + _this.handleMargin.y)) {
								newY = (0 + _this.handleMargin.y);
							}
						}

						_this.handle.css({
							top: newY
						});
						_this.pos.y = newY - _this.handleMargin.y;
					}
					$(document).off(".slide-move");
					
					_this.calcValue();
					_this.container.trigger("wt:change");
				});
			},

			change_handler : function(e, _this) {
				if(typeof(_this.onchange) == "function") {
					_this.onchange();
				}
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e, _this);})
					.on("mousedown", function(e){_this.mousedown_handler(e, _this);})
					.on("wt:change", function(e){_this.change_handler(e, _this);});
			}
		};
		slider.constructor(params);

		return slider;
	},

	Slider2D : function(params) {
		var slider2d = {
			realValue: {
				x: 0.0,
				y: 0.0
			},
			value: {
				x: 0,
				y: 0
			},
			max: {
				x: 100,
				y: 100
			},
			min: {
				x: 0,
				y: 0
			},
			handleMargin: {
				x: 0,
				y: 0
			},
			pos: {
				x: 0,
				y: 0
			},
			container: {},
			range: 1,
			handle: {},
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.handle.css({
					left: (this.pos.x + this.handleMargin.x),
					top: (this.pos.y + this.handleMargin.y)
				});

				this.addEventListeners();
			},

			calcValue : function() {

				if(this.pos.x != 0) {
					this.realValue.x = this.pos.x / this.container.width();
				} else {
					this.realValue.x = 0;
				}

				if(this.pos.y != 0) {
					this.realValue.y = this.pos.y / this.container.height();
				} else {
					this.realValue.y = 0;
				}


				this.value.x = Math.ceil(this.realValue.x * this.max.x);
				this.value.y = Math.ceil(this.realValue.y * this.max.y);
			},

			calcPos : function() {
				this.pos.x = this.container.width() * this.realValue.x;
				this.pos.y = this.container.height() * this.realValue.y;

				this.handle.css({
					left: this.pos.x + this.handleMargin.x,
					top: this.pos.y + this.handleMargin.y
				});
			},

			setValue : function(value) {
				this.value = value;
				this.realValue.x = value.x / this.max.x;
				this.realValue.y = value.y / this.max.y;
				this.calcPos();
			},

			getValue : function() {
				return this.value;
			},

			click_handler : function(e, _this) {
				var x = e.clientX;
				var y = e.clientY;

				var originX = _this.container.offset().left;
				var originY = _this.container.offset().top;

				var newX = ((x - originX) + (_this.handleMargin.x));
				var newY = ((y - originY) + (_this.handleMargin.y));

				if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
					if(newX > (_this.container.width() + _this.handleMargin.x)) {
						newX = (_this.container.width() + _this.handleMargin.x);
					} else if(newX < (0 + this.handleMargin.x)) {
						newX = (0 + _this.handleMargin.x);
					}
				}

				if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
					if(newY > (_this.container.height() + _this.handleMargin.y)) {
						newY = (_this.container.height() + _this.handleMargin.y);
					} else if(newY < (0 + _this.handleMargin.y)) {
						newY = (0 + _this.handleMargin.y);
					}
				}

				_this.handle.css({
					left: newX,
					top: newY
				});
				_this.pos.x = newX - _this.handleMargin.x;
				_this.pos.y = newY - _this.handleMargin.y;

				_this.calcValue();
				_this.container.trigger("wt:change");
			},

			mousedown_handler : function(e, _this) {
				var x = e.clientX;
				var y = e.clientY;

				var originX = _this.container.offset().left;
				var originY = _this.container.offset().top;

				var dX = x - originX;
				var dY = y - originY;

				$(document).on("mousemove.slide-move", function(event) {
					var currX = event.clientX;
					var currY = event.clientY;

					var newX = ((currX - originX) + (_this.handleMargin.x));
					var newY = ((currY - originY) + (_this.handleMargin.y));

					if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
						if(newX > (_this.container.width() + _this.handleMargin.x)) {
							newX = (_this.container.width() + _this.handleMargin.x);
						} else if(newX < (0 + _this.handleMargin.x)) {
							newX = (0 + _this.handleMargin.x);
						}
					}

					if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
						if(newY > (_this.container.height() + _this.handleMargin.y)) {
							newY = (_this.container.height() + _this.handleMargin.y);
						} else if(newY < (0 + _this.handleMargin.y)) {
							newY = (0 + _this.handleMargin.y);
						}
					}

					_this.handle.css({
						left: newX,
						top: newY
					});

					_this.pos.x = newX - _this.handleMargin.x;
					_this.pos.y = newY - _this.handleMargin.y;

					_this.calcValue();
					_this.container.trigger("wt:change");
				});

				$(document).on("mouseup.slide-move", function(event) {
					var currX = event.clientX;
					var currY = event.clientY;

					var newX = ((currX - originX) + (_this.handleMargin.x));
					var newY = ((currY - originY) + (_this.handleMargin.y));

					if(newX > (_this.container.width() + _this.handleMargin.x) || newX < (0 + _this.handleMargin.x)) {
						if(newX > (_this.container.width() + _this.handleMargin.x)) {
							newX = (_this.container.width() + _this.handleMargin.x);
						} else if(newX < (0 + _this.handleMargin.x)) {
							newX = (0 + _this.handleMargin.x);
						}
					}

					if(newY > (_this.container.height() + _this.handleMargin.y) || newY < (0 + _this.handleMargin.y)) {
						if(newY > (_this.container.height() + _this.handleMargin.y)) {
							newY = (_this.container.height() + _this.handleMargin.y);
						} else if(newY < (0 + _this.handleMargin.y)) {
							newY = (0 + _this.handleMargin.y);
						}
					}

					_this.handle.css({
						left: newX,
						top: newY
					});

					_this.pos.x = newX - _this.handleMargin.x;
					_this.pos.y = newY - _this.handleMargin.y;

					$(document).off(".slide-move");
					_this.calcValue();
					_this.container.trigger("wt:change");
				});
			},

			change_handler : function(e, _this) {
				if(typeof(_this.onchange) == "function") {
					_this.onchange();
				}
			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e, _this);})
					.on("mousedown", function(e){_this.mousedown_handler(e, _this);})
					.on("wt:change", function(e){_this.change_handler(e, _this);});
			}
		};
		slider2d.constructor(params);

		return slider2d;
	}
};

WTSlider = WT.ui.slider.Slider;
WTSlider2D = WT.ui.slider.Slider2D;