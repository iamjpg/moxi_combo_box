
(($, window, document) ->

  pluginName = "moxiComboBox"

  defaults =
    livequery: true
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
      cursor: "pointer"
    integer:
      prepend: ''
      append: ''

  Plugin = (element, options) ->
    @element = element
    @el = $(element)
    @el.addClass("mcb_input")
    @resizeListener = undefined
    @innerhtml = ""
    @live_query_lock = false
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
      @dynamicIntegerValues()  if @options.integer.start
      @setGeneralEvents()

    setGeneralEvents: ->

      _this = @

      @el.on("focus", =>
        $(".mcb_outer_container").hide()
        $("#mcb_" + @el.attr("name"))
        .css("height", 0)
        .show()
        .stop()
        .animate({ height : @options.containercss.height })
      )

      @initLiveQuery()

    initLiveQuery: ->
      return false  unless @options.livequery or @live_query_lock

      el = @el

      el.off("keypress").on("keyup", (e) =>
        @filterResults()
      )

    filterResults: ->

      el = @el

      $.each($(".mcb_inner_wrapper").children(), () ->
        _this = $(this)
        if _this.html().indexOf(el.val()) is -1
          _this.hide()
        else
          _this.show()
      )

      @setContainerHeight()

    setContainerHeight: ->
      if ($(".mcb_inner_wrapper").outerHeight() <= $("#mcb_" + @el.attr("name")).outerHeight())
        h = $(".mcb_inner_wrapper").outerHeight()
        overflow = "none"
      else
        h = @options.containercss.height
        overflow = "auto"

      $("#mcb_" + @el.attr("name")).css
        height: h
        overflow: overflow


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

      @injectLabel(@options.prelabel)

      start = parseInt(@options.integer.start)

      @innerhtml += "<div class=\"mcb_inner\">" + @parseInteger(@options.integer.start) + "</div>"

      while start < @options.integer.end
        val = (parseInt(start) + @returnIncrement(parseInt(start)))
        @innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + @el.attr("name") + "\">" + @parseInteger(val) + "</div>"
        start = val

      @injectLabel(@options.postlabel)

      @dd_div.html(@innerhtml)

      $("#mcb_" + @el.attr("name")).wrapInner("<div class=\"mcb_inner_wrapper\"></div>")

      $(".mcb_inner").css(@options.innercss)

      @setClickEvents()

    injectLabel: (label) ->
      return false  unless label
      @innerhtml += "<div class=\"mcb_inner\">" + label + "</div>"

    setClickEvents: (obj) ->
      _this = @
      $(".mcb_inner_wrapper").children().on("click", ->
        $("input[name=" + $(this).data("inputelement") + "]").val($(this).html())
        _this.dd_div.hide()
      )

    parseInteger: (val) ->
      return false  if val is `undefined`
      if @options.integer
        val = val.format()
      else
        val = val

      return @options.integer.prepend + val + @options.integer.append


    returnIncrement: (val) ->
      inc = 1
      if val < 10
        inc = 1
      else if val >= 10 and val < 100
        inc = 10
      else if val >= 100 and val < 1000
        inc = 100
      else if val >= 1000 and val < 10000
        inc = 1000
      else if val >= 10000 and val < 100000
        inc = 10000
      else if val >= 10000 and val < 500000
        inc = 25000
      else if val >= 500000 and val < 1000000
        inc = 50000
      else if val >= 1000000 and val < 2000000
        inc = 100000
      else
        inc = 1000000


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
      @setElementPosition()

      $("#mcb_" + @el.attr("name")).css
        top: @el_pos_y + @el.outerHeight()
        left: @el_pos_x



  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)  unless $.data(this, "plugin_" + pluginName)
      return

  return
) jQuery, window, document

# Listen for clicks/touches. Hide if not interacting with the created element of the input.
$(document).on("click", (e) =>
  _target = e.target || e.srcElement
  _class = $(_target).attr("class") || ""

  $(".mcb_outer_container").hide()  if _class.indexOf("mcb_") is -1
)

# Hide the containers when the tab button is clicked.
$(document).on("keydown", ".mcb_input", (e) =>
  $(".mcb_outer_container").hide()  if e.which is 9
)

Number::format = (n, x) ->
  re = "\\d(?=(\\d{" + (x or 3) + "})+" + ((if n > 0 then "\\." else "$")) + ")"
  @toFixed(Math.max(0, ~~n)).replace new RegExp(re, "g"), "$&,"
