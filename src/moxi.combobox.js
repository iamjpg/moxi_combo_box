var wsllc_ls_acres, wsllc_ls_bathmin, wsllc_ls_sqft;

wsllc_ls_acres = [".25 acres", ".5 acres", "1 acre", "2 acres", "3 acres", "4 acres", "5 acres", "10 acres", "40 acres", "100+ acres"];

wsllc_ls_sqft = ["2,000 SF", "4,500 SF", "6,500 SF", "8,000 SF", "10,890 SF", "21,780 SF"];

wsllc_ls_bathmin = ["1+ Baths", "1.25+ Baths", "1.5+ Baths", "1.75+ Baths", "2+ Baths", "2.25+ Baths", "2.5+ Baths", "2.75+ Baths", "3+ Baths", "3.25+ Baths", "3.5+ Baths", "3.75+ Baths", "4+ Baths", "4.25+ Baths", "4.50+ Baths", "4.75+ Baths", "5+ Baths"];

(function($, window, document) {
  var Plugin, defaults, pluginName;
  pluginName = "moxiComboBox";
  defaults = {
    livequery: true,
    containercss: {
      position: "absolute",
      width: 150,
      height: 200,
      background: "#f5f5f5",
      overflow: "auto",
      "z-index": 50000,
      "-webkit-box-shadow": "0 5px 10px 0 #B8B8B8",
      "box-shadow": "0 5px 10px 0 #B8B8B8"
    },
    innercss: {
      padding: 10,
      "margin-bottom": 1,
      background: "#dcdcdc",
      cursor: "pointer"
    },
    integer: {
      prepend: '',
      append: ''
    }
  };
  Plugin = function(element, options) {
    this.element = element;
    this.el = $(element);
    this.el.addClass("mcb_input");
    this.innerhtml = "";
    this.options = $.extend(true, {}, defaults, options);
    this.init();
  };
  Plugin.prototype = {
    init: function() {
      if (this.options.destroy) {
        this.destroy();
        return false;
      }
      this.createContainer();
      if (this.options.integer.start) {
        this.dynamicIntegerValues();
      }
      if (this.options.data) {
        this.populateArrayValues();
      }
      return this.setGeneralEvents();
    },
    setGeneralEvents: function() {
      var _this;
      _this = this;
      this.el.on("focus.moxicombo", (function(_this) {
        return function() {
          $(".mcb_outer_container").hide();
          return $("#mcb_" + _this.el.attr("name")).css("height", 0).show().stop().animate({
            height: _this.options.containercss.height
          }, function() {
            return $(this).css("overflow", "auto");
          });
        };
      })(this));
      this.initLiveQuery();
      return this.el.on("blur.moxicombo", (function(_this) {
        return function() {
          return setTimeout(function() {
            return $(".mcb_inner").show();
          }, 500);
        };
      })(this));
    },
    initLiveQuery: function() {
      if (!this.options.livequery) {
        return false;
      }
      return this.el.off("keypress").on("keyup.moxicombo", (function(_this) {
        return function(e) {
          return _this.filterResults();
        };
      })(this));
    },
    filterResults: function() {
      var el;
      el = this.el;
      return $.each($(document.activeElement).parent().find(".mcb_outer_container").children(":first").children(), function() {
        var val, _this;
        _this = $(this);
        val = el.val().replace(/[^0-9\.]+/g, '');
        if (_this.html().replace(/[^0-9\.]+/g, '').substring(0, val.length).indexOf(val) !== 0) {
          return _this.hide();
        } else {
          return _this.show();
        }
      });
    },
    calculateContainerHeight: function() {
      var obj;
      obj = {};
      if ($(".mcb_inner_wrapper").outerHeight() <= $("#mcb_" + this.el.attr("name")).outerHeight()) {
        obj.h = $(".mcb_inner_wrapper").outerHeight();
        obj.overflow = "none";
      } else {
        obj.h = this.options.containercss.height;
        obj.overflow = "auto";
      }
      return obj;
    },
    setContainerHeight: function() {
      var obj;
      obj = this.calculateContainerHeight();
      return $("#mcb_" + this.el.attr("name")).css({
        height: obj.h,
        overflow: obj.overflow
      });
    },
    createContainer: function() {
      this.options.containercss.display = "none";
      $("<div />", {
        id: "mcb_" + this.el.attr("name"),
        "class": "mcb_outer_container",
        css: this.options.containercss
      }).appendTo(this.el.parent());
      return this.dd_div = $("#mcb_" + this.el.attr("name"));
    },
    populateArrayValues: function() {
      this.injectLabel(this.options.prelabel);
      $.each(this.options.data, (function(_this) {
        return function(i, o) {
          return _this.innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + _this.el.attr("name") + "\">" + o + "</div>";
        };
      })(this));
      this.injectLabel(this.options.postlabel);
      return this.writeInnerHtml();
    },
    writeInnerHtml: function() {
      this.dd_div.html(this.innerhtml);
      $("#mcb_" + this.el.attr("name")).wrapInner("<div class=\"mcb_inner_wrapper\"></div>");
      $(".mcb_inner").css(this.options.innercss);
      return this.setClickEvents();
    },
    dynamicIntegerValues: function() {
      var start, val;
      this.injectLabel(this.options.prelabel);
      start = parseInt(this.options.integer.start);
      this.innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + this.el.attr("name") + "\">" + this.parseInteger(this.options.integer.start) + "</div>";
      while (start < this.options.integer.end) {
        val = parseInt(start) + this.returnIncrement(parseInt(start));
        this.innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + this.el.attr("name") + "\">" + this.parseInteger(val) + "</div>";
        start = val;
      }
      this.injectLabel(this.options.postlabel);
      return this.writeInnerHtml();
    },
    injectLabel: function(label) {
      if (!label) {
        return false;
      }
      return this.innerhtml += "<div class=\"mcb_inner mcb_label mcb_pre_post_label\" data-inputelement=\"" + this.el.attr("name") + "\">" + label + "</div>";
    },
    setClickEvents: function(obj) {
      var _this;
      _this = this;
      return $(".mcb_inner_wrapper").children().on("click", function(e) {
        if ($(this).hasClass("mcb_pre_post_label")) {
          $(".mcb_outer_container").hide();
          $("input[name=" + $(this).data("inputelement") + "]").val("");
          Placeholders.enable();
          return false;
        }
        $("input[name=" + $(this).data("inputelement") + "]").val($(this).html());
        return _this.dd_div.hide();
      });
    },
    parseInteger: function(val) {
      if (val === undefined) {
        return false;
      }
      if (this.options.integer.start) {
        val = val.format();
      } else {
        val = val;
      }
      return this.options.integer.prepend + val + this.options.integer.append;
    },
    returnIncrement: function(val) {
      var inc;
      inc = 1;
      if (val < 10) {
        return inc = 1;
      } else if (val >= 10 && val < 100) {
        return inc = 10;
      } else if (val >= 100 && val < 1000) {
        return inc = 100;
      } else if (val >= 1000 && val < 10000) {
        return inc = 1000;
      } else if (val >= 10000 && val < 100000) {
        return inc = 10000;
      } else if (val >= 10000 && val < 500000) {
        return inc = 25000;
      } else if (val >= 500000 && val < 1000000) {
        return inc = 50000;
      } else if (val >= 1000000 && val < 2000000) {
        return inc = 100000;
      } else {
        return inc = 1000000;
      }
    },
    destroy: function() {
      return this.el.unbind("focus.moxicombo").unbind("keyup.moxicombo").unbind("click");
    }
  };
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      $.data(this, "plugin_" + pluginName, new Plugin(this, options));
    });
  };
})(jQuery, window, document);

(function($) {
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
  return Number.prototype.format = function(n, x) {
    var re;
    re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
  };
})(jQuery);
