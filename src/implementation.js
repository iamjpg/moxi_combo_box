(function($) {

  $("input[name=demo1]").moxiComboBox({
    name: 'max_price',
    livequery: true,
    prelabel: 'No Max',
    postlabel: 'No Max',
    integer: {
      start: 1000,
      end: 10000000,
      prepend: '$'
    },
    containercss: {

    }
  });


  $("input[name=demo2]").moxiComboBox({
    name: 'min_sf',
    livequery: true,
    prelabel: 'No Min',
    postlabel: 'No Min',
    integer: {
      start: 100,
      end: 10000,
      append: ' SF'
    },
    containercss: {

    }
  });

})(window.jQuery)
