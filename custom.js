//Table of all filters
//

$(document).ready(function () {

  $(".filter").click(function (event) {
    $("#"+ event.target.id ).toggleClass("active");
    $("."+ event.target.id ).toggle("slow");
  });

}
)


