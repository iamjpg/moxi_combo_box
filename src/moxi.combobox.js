(function($, window, document) {
  var Plugin, defaults, pluginName;
  Plugin = function(element, options) {
    this.element = element;
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
      return alert(1);
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
