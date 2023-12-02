const express = require("express");
const {
  registerUser,
  loginUser,
  createProfile,
  viewProfile,
  editProfile,
  createPost,
  getUserPosts,
  viewPost,
  createComment,
  getComments,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile/create", validateToken, createProfile);
router.get("/profile/view", validateToken, viewProfile);
router.put("/profile/edit", validateToken, editProfile);

// Post routes
router.post("/post/create", validateToken, createPost);
router.get("/post/userposts", validateToken, getUserPosts);
router.get("/post/view", validateToken, viewPost);

// Comment routes
router.post("/comments/create/:postId", validateToken, createComment);
router.get("/comments/:postId", validateToken, getComments);

module.exports = router;
