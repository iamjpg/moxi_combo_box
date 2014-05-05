#
# * jQuery ComboBox Plugin
# * Original author: @iamjpg <jgiven@gmail.com>
# * Licensed under the MIT license
#

(($, window, document) ->

  # Name the plugin
  pluginName = "moxiComboBox"

  # Default object properties
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

  # Constructor
  Plugin = (element, options) ->
    # Native DOM element reference
    @element = element
    # jQuery object of DOM element
    @el = $(element)
    # Adding a class to the input object
    @el.addClass("mcb_input")
    # Default innerHTML to ""
    @innerhtml = ""
    # Map passed option values
    @options = $.extend(true, {}, defaults, options)
    # Call the init method
    @init()
    return

  # Object prototype
  Plugin:: =
    # init()
    init: ->
      if @options.destroy
        @destroy()
        return false
      # Create the container for dropdown
      @createContainer()
      # If the plugin user passes an integer range, then create the dropdown
      # dynamically
      @dynamicIntegerValues()  if @options.integer.start
      @populateArrayValues()  if @options.data
      # Set events
      @setGeneralEvents()

    # setGeneralEvents()
    setGeneralEvents: ->
      # Local object reference
      _this = @
      # On focus of input element, animate the corresponding dropdown.
      @el.on("focus", =>
        $(".mcb_outer_container").hide()
        $("#mcb_" + @el.attr("name"))
        .css("height", 0)
        .show()
        .stop()
        .animate({ height : @options.containercss.height }, ->
          $(this).css("overflow","auto")
        )
      )
      # Enable live query
      @initLiveQuery()

    # initLiveQuery()
    initLiveQuery: ->
      # return false if user opts out of livequery
      return false  unless @options.livequery
      # On keyup, filter results
      @el.off("keypress").on("keyup", (e) =>
        @filterResults()
      )

    # filterResults()
    filterResults: ->
      # jQuery element reference
      el = @el
      # loop the elements looking for a match then show or hide element.
      $.each($(".mcb_inner_wrapper").children(), () ->
        _this = $(this)
        if _this.html().indexOf(el.val()) is -1
          _this.hide()
        else
          _this.show()
      )
      # Set the container height based on the new filtered list
      # @setContainerHeight()

    # calculateContainerHeight()
    # Returns an object containing the values for container height + overflow
    calculateContainerHeight: ->
      obj = {}
      if ($(".mcb_inner_wrapper").outerHeight() <= $("#mcb_" + @el.attr("name")).outerHeight())
        obj.h = $(".mcb_inner_wrapper").outerHeight()
        obj.overflow = "none"
      else
        obj.h = @options.containercss.height
        obj.overflow = "auto"

      obj

    # setContainerHeight()
    # Responsible for setting the height on the dropdown
    setContainerHeight: ->
      # get container height values
      obj = @calculateContainerHeight()
      # set values on object
      $("#mcb_" + @el.attr("name")).css
        height: obj.h
        overflow: obj.overflow

    # createContainer()
    # Responsible for creating the dropdown container
    createContainer: ->
      # Hide containers
      @options.containercss.display = "none"
      # Create and print the elements parent node setting CSS.
      $("<div />",
        id: "mcb_" + @el.attr("name")
        class: "mcb_outer_container"
        css: @options.containercss
      ).appendTo @el.parent()
      # Object reference to the drop down container
      @dd_div = $("#mcb_" + @el.attr("name"))

    populateArrayValues: ->
      @injectLabel(@options.prelabel)
      $.each(@options.data, (i,o) =>
        @innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + @el.attr("name") + "\">" + o + "</div>"
      )
      @injectLabel(@options.postlabel)

      @writeInnerHtml()

    writeInnerHtml: ->
      @dd_div.html(@innerhtml)
      #Wrap the innerhtml with another div
      $("#mcb_" + @el.attr("name")).wrapInner("<div class=\"mcb_inner_wrapper\"></div>")
      # Set the CSS on the individual divs
      $(".mcb_inner").css(@options.innercss)
      # set click events
      @setClickEvents()

    # dynamicIntegerValues()
    # Responsible for creating the interior dropdown values from the numeric
    # range passed by the user.
    dynamicIntegerValues: ->
      # If there is a prelabel, inject it.
      @injectLabel(@options.prelabel)
      # The numeric start value
      start = parseInt(@options.integer.start)
      # create the first div with the first value
      @innerhtml += "<div class=\"mcb_inner\">" + @parseInteger(@options.integer.start) + "</div>"
      # Loop over integer range creating dropdown values
      while start < @options.integer.end
        val = (parseInt(start) + @returnIncrement(parseInt(start)))
        @innerhtml += "<div class=\"mcb_inner\" data-inputelement=\"" + @el.attr("name") + "\">" + @parseInteger(val) + "</div>"
        start = val
      # Inject the postlabel if there is one
      @injectLabel(@options.postlabel)

      @writeInnerHtml()

    # injectLabel()
    # Responsible for injecting labels like "No Min" or "No Max" for dynamically
    # created integer fields.
    injectLabel: (label) ->
      return false  unless label
      @innerhtml += "<div class=\"mcb_inner mcb_label mcb_pre_post_label\" data-inputelement=\"" + @el.attr("name") + "\">" + label + "</div>"

    # setClickEvents()
    # Responsible for setting click events on the individual dropdown divs.
    setClickEvents: (obj) ->
      _this = @
      $(".mcb_inner_wrapper").children().on("click", ->
        val = if ($(this).hasClass("mcb_pre_post_label")) then "" else $(this).html()
        $("input[name=" + $(this).data("inputelement") + "]").val(val)
        _this.dd_div.hide()
      )

    # parseInteger()
    # Responsible for formatting integers with commas
    parseInteger: (val) ->
      return false  if val is `undefined`
      if @options.integer.start
        val = val.format()
      else
        val = val

      return @options.integer.prepend + val + @options.integer.append

    # returnIncrement()
    # Our set integer value increment.
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

    destroy: ->
      @el.unbind("focus").unbind("keyup").unbind("click")


  # Plugin constructor wrapper
  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)
      return

  return
) jQuery, window, document

(($) ->

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

  # Extending the Number object for formatting
  Number::format = (n, x) ->
    re = "\\d(?=(\\d{" + (x or 3) + "})+" + ((if n > 0 then "\\." else "$")) + ")"
    @toFixed(Math.max(0, ~~n)).replace new RegExp(re, "g"), "$&,"


) jQuery
