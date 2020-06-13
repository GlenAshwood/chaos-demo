var express = require("express");
var router  = express.Router();
var Tool = require("../models/tool");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var { isLoggedIn, checkUserTool, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all tools
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all tools from DB
      Tool.find({name: regex}, function(err, allTools){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allTools);
         }
      });
  } else {
      // Get all tools from DB
      Tool.find({}, function(err, allTools){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allTools);
            } else {
              res.render("tools/index",{tools: allTools, page: 'tools'});
            }
         }
      });
  }
});

//CREATE - add new tool to DB
router.post("/", isLoggedIn, isSafe, function(req, res){
  // get data from form and add to tools array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var review = req.body.review;
  var rating = req.body.rating;
  
  var newTool = {name: name, image: image, description: desc, review: review, author:author,rating: rating};
  // Create a new tool and save to DB
  Tool.create(newTool, function(err, newlyCreated){
    if(err){
        console.log(err);
    } else {
        //redirect back to tools page
        console.log(newlyCreated);
        res.redirect("/tools");
        }
    });
});

//NEW - show form to create new tool
router.get("/new", isLoggedIn, function(req, res){
   res.render("tools/new"); 
});

// SHOW - shows more info about one tool
router.get("/:id", function(req, res){
    //find the tool with provided ID
    Tool.findById(req.params.id).populate("comments").exec(function(err, foundTool){
        if(err || !foundTool){
            console.log(err);
            req.flash('error', 'Sorry, that tool does not exist!');
            return res.redirect('/tools');
        }
        console.log(foundTool)
        //render show template with that tool
        res.render("tools/show", {tool: foundTool});
    });
});

// EDIT - shows edit form for a tool
router.get("/:id/edit", isLoggedIn, checkUserTool, function(req, res){
  //render edit template with that tool
  res.render("tools/edit", {tool: req.tool});
});

// PUT - updates tool in the database
router.put("/:id", isSafe, function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, review: req.body.review, rating: req.body.rating};
    Tool.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, tool){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/tools/" + tool._id);
        }
    });
  });

// DELETE - removes tool and its comments from the database
router.delete("/:id", isLoggedIn, checkUserTool, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.tool.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.tool.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Tool deleted!');
            res.redirect('/tools');
          });
      }
    })
});

module.exports = router;

