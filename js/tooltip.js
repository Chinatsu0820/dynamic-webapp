/*----- jQuery -----*/
/*-------- for tooltips of sns icons -------*/
$(function() {
    $(".snsButton").mouseover(function() {
      $(this).next(".toolTip").fadeIn();
    });
    $(".snsButton").mouseout(function() {
      $(this).next(".toolTip").fadeOut();
    });
    $(".snsButton").mousemove(function(e) {
      $(this).next(".toolTip").css({
        // adjust the position of the tooltip
        "top": e.pageY + 20 + "px",
        "left": e.pageX + -30 + "px" 
      });
    });
  });