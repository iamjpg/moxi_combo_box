(function($, window, document) {
  var Plugin, defaults, pluginName;
  Plugin = function(element, options) {
    this.element = element;
    this.el = $(element);
    this.resizeListener = void 0;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  };
  pluginName = "moxiComboBox";
  defaults = {
    propertyName: "value"
  };
  Plugin.prototype = {
    init: function() {
      this.setResizeListener();
      return this.setElementPosition();
    },
    setElementPosition: function() {
      this.el_pos_y = this.el.offset().top;
      return this.el_pos_x = this.el.offset().top;
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
