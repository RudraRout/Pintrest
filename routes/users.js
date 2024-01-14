const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/project-pintrest");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: String,
  profileImage: String,
  boards: [],
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true
  },
  password: {
    type: String
  },
  posts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }]
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);