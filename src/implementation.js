(function($) {

  $("input[name=demo1]").moxiComboBox({
    livequery: true,
    integer: {
      start: 100,
      end: 10000,
      increment: 10
    },
    containercss: {

    }
  });


  $("input[name=demo2]").moxiComboBox();

})(window.jQuery)
