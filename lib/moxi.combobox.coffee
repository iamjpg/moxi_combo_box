
(($, window, document) ->

  Plugin = (element, options) ->
    @element = element
    @options = $.extend({}, defaults, options)
    @_defaults = defaults
    @_name = pluginName
    @init()
    return

  pluginName = "moxiComboBox"

  defaults =
    propertyName: "value"

  Plugin:: =
  
    init: ->


  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)  unless $.data(this, "plugin_" + pluginName)
      return

  return
) jQuery, window, document
