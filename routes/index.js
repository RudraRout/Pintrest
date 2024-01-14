var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));


// GET ROUTES
router.get('/', function (req, res, next) {
  res.render('index', { nav: false });
});

router.get('/register', (req, res) => {
  res.render('register', { nav: false });
});

router.get('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })
});

router.get('/show/posts', async (req, res, next) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("show", { user, nav: true });
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("profile", { user, nav: true });
});
router.get('/add', isLoggedIn, async (req, res) => {
  res.render("add", { nav: true });
});

router.get('/feed', async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find()
    .populate("user")

  res.render("feed", { user, posts, nav: true });
});


// POST ROUTES


router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile")
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});

router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
  failureFlash: false
}));

router.post('/register', function (req, res, next) {
  const { username, email, contact, name } = req.body;
  const data = new userModel({
    username,
    contact,
    email,
    name
  });

  userModel.register(data, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
module.exports = router;
