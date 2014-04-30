(function($, window, document) {
  var Plugin, defaults, pluginName;
  pluginName = "moxiComboBox";
  defaults = {
    containercss: {
      position: "absolute",
      width: 150,
      height: 200,
      background: "#f5f5f5",
      overflow: "auto",
      "-webkit-box-shadow": "0 5px 10px 0 #B8B8B8",
      "box-shadow": "0 5px 10px 0 #B8B8B8"
    },
    innercss: {
      padding: 10,
      "margin-bottom": 1,
      background: "#dcdcdc"
    }
  };
  Plugin = function(element, options) {
    this.element = element;
    this.el = $(element);
    this.el.addClass("mcb_input");
    this.resizeListener = void 0;
    this.innerhtml = "";
    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  };
  Plugin.prototype = {
    init: function() {
      this.setResizeListener();
      this.setElementPosition();
      this.createContainer();
      if (this.options.integer) {
        this.dynamicIntegerValues();
      }
      return this.setEvents();
    },
    setEvents: function() {
      return this.el.on("focus", (function(_this) {
        return function() {
          $(".mcb_outer_container").hide();
          return $("#mcb_" + _this.el.attr("name")).css("height", 0).show().stop().animate({
            height: _this.options.containercss.height
          });
        };
      })(this));
    },
    createContainer: function() {
      this.options.containercss.top = this.el_pos_y + this.el.outerHeight();
      this.options.containercss.left = this.el_pos_x;
      this.options.containercss.display = "none";
      $("<div />", {
        id: "mcb_" + this.el.attr("name"),
        "class": "mcb_outer_container",
        css: this.options.containercss
      }).appendTo("body");
      return this.dd_div = $("#mcb_" + this.el.attr("name"));
    },
    dynamicIntegerValues: function() {
      var i, start, val;
      start = parseInt(this.options.integer.start);
      this.innerhtml += "<div class=\"mcb_inner\">" + this.options.integer.start + "</div>";
      i = 0;
      while (i < this.options.integer.end - 1) {
        val = parseInt(start) + parseInt(this.options.integer.increment);
        this.innerhtml += "<div class=\"mcb_inner\">" + val + "</div>";
        start = val;
        i++;
      }
      this.dd_div.html(this.innerhtml);
      return $(".mcb_inner").css(this.options.innercss);
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
      this.setElementPosition();
      return $("#mcb_" + this.el.attr("name")).css({
        top: this.el_pos_y + this.el.outerHeight(),
        left: this.el_pos_x
      });
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

$(document).on("click", (function(_this) {
  return function(e) {
    var _class, _target;
    _target = e.target || e.srcElement;
    _class = $(_target).attr("class") || "";
    if (_class.indexOf("mcb_") === -1) {
      return $(".mcb_outer_container").hide();
    }
  };
})(this));

$(document).on("keydown", ".mcb_input", (function(_this) {
  return function(e) {
    if (e.which === 9) {
      return $(".mcb_outer_container").hide();
    }
  };
})(this));
