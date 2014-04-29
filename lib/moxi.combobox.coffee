
(($, window, document) ->

  Plugin = (element, options) ->
    @element = element
    @el = $(element)
    @resizeListener = undefined
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
      @setResizeListener()
      @setElementPosition()

    setElementPosition: ->
      # set the x/y of the element.
      @el_pos_y = @el.offset().top
      @el_pos_x = @el.offset().top

    setResizeListener: ->
      window.onresize = =>
        clearTimeout @resizeListener
        @resizeListener = setTimeout(=>
          @resizedWindow()
        , 200)
        return

    resizedWindow: ->
      console.log "window resized"






  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)  unless $.data(this, "plugin_" + pluginName)
      return

  return
) jQuery, window, document
