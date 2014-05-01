(function($) {

  $("input[name=demo1]").moxiComboBox({
    livequery: true,
    integer: {
      start: 1000,
      end: 10000000,
      increment: 10,
      prepend: '$'
    },
    containercss: {

    }
  });


  $("input[name=demo2]").moxiComboBox();

})(window.jQuery)
