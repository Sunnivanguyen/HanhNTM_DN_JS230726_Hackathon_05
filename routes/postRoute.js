const express = require("express");
const fs = require("fs");

const postRoute = express.Router();

const readPostsFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      "./dev-data/data/posts.json",
      "utf-8"
    );
    const posts = JSON.parse(data);
    req.posts = posts;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while reading the file",
    });
  }
};

//Get All Posts
postRoute.get("/", readPostsFile, (req, res) => {
  const posts = req.posts;
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts: posts,
    },
  });
});

//Get All Posts of a User
postRoute.get("/users/:user_id", readPostsFile, (req, res) => {
  const userId = req.params.user_id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts: posts,
    },
  });
});

//Get A Post of A User
postRoute.get("/:post_id/users/:user_id", readPostsFile, (req, res) => {
  const userId = req.params.user_id;
  const id = req.params.post_id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  const post = posts.find((post) => String(post.id) === id);
  if (post) {
    res.status(200).json({
      status: "success",
      data: {
        post: post,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No post found with the ID",
    });
  }
});

//Create A Post of A User
postRoute.post("/users/:user_id", readPostsFile, async (req, res, next) => {
  const userId = req.params.user_id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  const newPost = {
    userId: userId,
    id: posts[posts.length - 1].id + 1,
    ...req.body,
  };

  posts.push(newPost);

  try {
    await fs.promises.writeFile(
      "./dev-data/data/posts.json",
      JSON.stringify(posts)
    );
    res.status(200).json({
      status: "success",
      length: posts.length,
      data: { newPost },
    });
  } catch (err) {
    next(err);
  }
});

//Update A Post of A User
postRoute.put("/:post_id/users/:user_id", readPostsFile, (req, res) => {
  const userId = req.params.user_id;
  const id = req.params.post_id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  const post = posts.find((post) => String(post.id) === id);

  if (post) {
    const updatedPost = {
      ...post,
      ...req.body,
    };

    const updatedPosts = posts.map((post) =>
      String(post.id) === id ? updatedPost : post
    );

    res.status(200).json({
      status: "success",
      results: updatedPosts.length,
      data: {
        posts: updatedPosts,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No Post found with the ID",
    });
  }
});

//Delete A Post of A User
postRoute.delete(
  "/:post_id/users/:user_id",
  readPostsFile,
  async (req, res) => {
    const userId = req.params.user_id;
    const id = req.params.post_id;
    const posts = req.posts.filter((post) => String(post.userId) === userId);
    const updatedPosts = posts.filter((post) => String(post.id) !== id);

    try {
      await fs.promises.writeFile(
        "./dev-data/data/posts.json",
        JSON.stringify(updatedPosts)
      );
      res.status(200).json({
        status: "success",
        results: updatedPosts.length,
        data: {
          posts: updatedPosts,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = postRoute;
