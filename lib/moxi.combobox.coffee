
(($, window, document) ->

  pluginName = "moxiComboBox"

  defaults =
    css:
      position: "absolute"
      width: 250
      height: 300
      background: "#f5f5f5"
      overflow: "auto"
      "-webkit-box-shadow": "0 5px 10px 0 #B8B8B8"
      "box-shadow": "0 5px 10px 0 #B8B8B8"

  Plugin = (element, options) ->
    @element = element
    @el = $(element)
    @resizeListener = undefined
    @options = $.extend(true, {}, defaults, options)
    @_defaults = defaults
    @_name = pluginName
    @init()
    return

  Plugin:: =

    init: ->
      @setResizeListener()
      @setElementPosition()
      @createContainer()

    createContainer: ->

      @options.css.top = @el_pos_y + @el.outerHeight()
      @options.css.left = @el_pos_x

      $("<div />",
        id: "mcb_" + @el.attr("name")
        css: @options.css
      ).appendTo "body"

    setElementPosition: ->
      # set the x/y of the element.
      @el_pos_y = @el.offset().top
      @el_pos_x = @el.offset().left

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
