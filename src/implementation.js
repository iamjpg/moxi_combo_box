(function($) {

  $("input[name=demo1]").moxiComboBox({
    integer: {
      start: 1,
      end: 200,
      increment: 1
    },
    containercss: {
      width: 100
    }
  });


  $("input[name=demo2]").moxiComboBox();

})(window.jQuery)
