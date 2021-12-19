const express = require("express");
const router = express.Router();
const db = require("../models/index");
const Post = db.Post;
const Sequelize = require("sequelize");

router.get("/", (req, res, next) => {
  Post.findAll()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.post("/", (req, res, next) => {
  let post_params = {
    name: req.body.name,
    description: req.body.description,
    metaInfo: req.body.metaInfo,
    commentsCount: req.body.commentsCount,
  };
  let post = Post.build(post_params);
  post
    .save({ userId: 11 })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.delete("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      post
        .destroy({ userId: 11 })
        .then((succ) => {
          res.status(204).json({});
        })
        .catch((err) => {
          res.status(422).json(err);
        });
    })
    .catch((err) => {
      res.status(422).json({ message: "post not found" });
    });
});

router.put("/:id", (req, res, next) => {
  let post_params = {
    name: req.body.name,
    description: req.body.description,
    metaInfo: req.body.metaInfo,
  };
  Post.findById(req.params.id)
    .then((post) => {
      post
        .update(post_params, { userId: 11 })
        .then((succ) => {
          res.status(200).json(post);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
    .catch((err) => {
      res.status(422).json({ message: "post not found" });
    });
});

module.exports = router;
