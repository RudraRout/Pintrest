const mongoose = require("mongoose");
const user = require("./users");
const postSchema = mongoose.Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  title: String,
  description: String,
  image: String,
  boards: [],

});


module.exports = mongoose.model("post", postSchema);