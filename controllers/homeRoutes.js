const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();

router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment", "post_id", "user_id", "created_at"],
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((PostData) => {
      const posts = PostData.map((post) => post.get({ plain: true }));
      res.render("homepage", {
        posts,
        logged_in: req.session.logged_in,
        username: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;