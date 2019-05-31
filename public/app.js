$(document).on("click", ".article button", function() {

    var parent = $(this).parent();
    var a = parent.find("a");
    var title = a.text();
    var text = parent.find("p").text();
    var link = a.attr("href");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "POST",
      url: "/api/article/",
      data: {
          title,
          text,
          link
      }
    })

      // With that done, add the note information to the page
      .then(function(data) {
        parent.parent().find(".alert").css("display", "block");
        parent.remove();
      });
  });

  $(document).on("click", ".clear-articles", function() {

  
    // Now make an ajax call for the Article
    $.ajax({
      method: "DELETE",
      url: "/api/article/",
    })
      // With that done, add the note information to the page
      .then(function(data) {
        window.location.href = "/";
      });
  });
  
 
 