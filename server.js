var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://rita:135038724Denver@ds145926.mlab.com:45926/heroku_f8s8dz53", { useNewUrlParser: true });

// Routes

app.get("/", function (req, res) {
  var posts = [];
  if (req.query.scrape) {
    axios.get("http://travelbloggercommunity.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      $("article").each(function (i, element) {
        var result = {};
        const titleLink = $(this)
          .find(".entry-title a");
        result.title = titleLink
          .text();
        result.link = titleLink
          .attr("href");
        result.description = $(this)
          .find(".entry-content p")
          .text();

        posts.push(result);

      });

      var hbsObject = {
        posts: posts,
        showscrapebtn: true,
        todo: false
      };
      res.render("home", hbsObject);
    });
  } else {
    var hbsObject = {
      posts: posts,
      showscrapebtn: true,
      todo: true
    };
    res.render("home", hbsObject);
  };
});


app.get("/saved", function (req, res) {

  db.Article.find({})
    .then(function (posts) {
      var hbsObject = {
        posts: posts
      };
      res.render("savedarticles", hbsObject);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/api/article", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.findOne({ title: req.body.title}, {text: req.body.text})
    .then(function (dbArticle) {
      if (!dbArticle) {
        // req.body.text = "Just testing this out"
           
        db.Article.create(req.body)
          .then(function (dbArticle) {
            res.json(dbArticle);
          })
          .catch(function (err) {
            res.json(err);
          });
      } else {
        res.json(dbArticle);
      }
    })
    .catch(function (err) {
      res.json(err);
    });

});

app.delete("/api/article", function (req, res) {
  db.Article.deleteMany({})
    .then(function () {
      res.end();
    })
})

app.listen(PORT, function () {
  console.log("http://localhost:" + PORT);
});
