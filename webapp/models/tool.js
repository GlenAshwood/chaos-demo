var mongoose = require("mongoose");

var toolSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   review: String,
   rating: String,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Tool", toolSchema);