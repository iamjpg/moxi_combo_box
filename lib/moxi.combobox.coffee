
(($, window, document) ->

  pluginName = "moxiComboBox"

  defaults =
    containercss:
      position: "absolute"
      width: 150
      height: 200
      background: "#f5f5f5"
      overflow: "auto"
      "-webkit-box-shadow": "0 5px 10px 0 #B8B8B8"
      "box-shadow": "0 5px 10px 0 #B8B8B8"
    innercss:
      padding: 10
      "margin-bottom": 1
      background: "#dcdcdc"

  Plugin = (element, options) ->
    @element = element
    @el = $(element)
    @el.addClass("mcb_input")
    @resizeListener = undefined
    @innerhtml = ""
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
      @dynamicIntegerValues()  if @options.integer
      @setEvents()

    setEvents: ->
      @el.on("focus", =>
        $(".mcb_outer_container").hide()
        $("#mcb_" + @el.attr("name"))
        .css("height", 0)
        .show()
        .stop()
        .animate({ height : @options.containercss.height })
      )

    createContainer: ->

      # Set the top and left css properties
      @options.containercss.top = @el_pos_y + @el.outerHeight()
      @options.containercss.left = @el_pos_x

      @options.containercss.display = "none"

      # Print the div to the dom
      $("<div />",
        id: "mcb_" + @el.attr("name")
        class: "mcb_outer_container"
        css: @options.containercss
      ).appendTo "body"

      @dd_div = $("#mcb_" + @el.attr("name"))

    dynamicIntegerValues: ->
      start = parseInt(@options.integer.start)
      @innerhtml += "<div class=\"mcb_inner\">" + @options.integer.start + "</div>"
      i = 0
      while i < @options.integer.end - 1
        val = (parseInt(start) + parseInt(@options.integer.increment))
        @innerhtml += "<div class=\"mcb_inner\">" + val + "</div>"
        start = val
        i++

      @dd_div.html(@innerhtml)

      $(".mcb_inner").css(@options.innercss)

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

$(document).on("click", (e) =>
  e.stopPropagation()
  _target = e.target || e.srcElement
  _class = $(_target).attr("class") || ""

  $(".mcb_outer_container").hide()  if _class.indexOf("mcb_") is -1
)
