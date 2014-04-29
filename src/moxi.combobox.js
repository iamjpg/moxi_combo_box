(function($, window, document) {
  var Plugin, defaults, pluginName;
  pluginName = "moxiComboBox";
  defaults = {
    css: {
      position: "absolute",
      width: 250,
      height: 300,
      background: "#f5f5f5",
      overflow: "auto",
      "-webkit-box-shadow": "0 5px 10px 0 #B8B8B8",
      "box-shadow": "0 5px 10px 0 #B8B8B8"
    }
  };
  Plugin = function(element, options) {
    this.element = element;
    this.el = $(element);
    this.resizeListener = void 0;
    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  };
  Plugin.prototype = {
    init: function() {
      this.setResizeListener();
      this.setElementPosition();
      return this.createContainer();
    },
    createContainer: function() {
      this.options.css.top = this.el_pos_y + this.el.outerHeight();
      this.options.css.left = this.el_pos_x;
      return $("<div />", {
        id: "mcb_" + this.el.attr("name"),
        css: this.options.css
      }).appendTo("body");
    },
    setElementPosition: function() {
      this.el_pos_y = this.el.offset().top;
      return this.el_pos_x = this.el.offset().left;
    },
    setResizeListener: function() {
      return window.onresize = (function(_this) {
        return function() {
          clearTimeout(_this.resizeListener);
          _this.resizeListener = setTimeout(function() {
            return _this.resizedWindow();
          }, 200);
        };
      })(this);
    },
    resizedWindow: function() {
      return console.log("window resized");
    }
  };
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
