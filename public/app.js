$(document).on("click", ".article button", function() {

    var parent = $(this).parent();
    var a = parent.find("a");
    var title = a.text();
    var description = parent.find("p").text();
    var link = a.attr("href");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "POST",
      url: "/api/article/",
      data: {
          title,
          description,
          link
      }
    })
      // With that done, add the note information to the page
      .then(function(data) {
        parent.parent().find(".alert").css("display", "block");
        parent.remove();
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  });