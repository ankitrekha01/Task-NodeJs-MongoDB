const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const zxcvbn = require("zxcvbn");
const sanitizeInput = require("../helper/sanitize");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  //Check username
  if (!validator.isAlphanumeric(username)) {
    res.status(400);
    throw new Error("Please enter a alphanumeric username");
  }
  // Check for the valid email or pasword
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 2) {
    res.status(400);
    throw new Error("Password is too weak. Please choose a stronger password");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //Hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  console.log(`User created:${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  // compare the password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: process.env.JWT_EXPIRATION_TIME || "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@desc View profile
//@route GET /profile/view
//@access protected
const viewProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    res.status(200).json({ user });
  }
});

//@desc Create profile for 1st time
//@route POST /profile/create
//@access protected
const createProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, dob } = req.body;
  const sanitizeFirstName = sanitizeInput(firstName);
  const sanitizeLastName = sanitizeInput(lastName);
  const sanitizeDob = sanitizeInput(dob);
  if (!sanitizeFirstName || !sanitizeLastName || !sanitizeDob) {
    res.status(400);
    throw new Error("All fields are required.");
  }
  if (!validator.isAlpha(sanitizeFirstName)) {
    res.json(400);
    throw new Error("Not valid First Name.(Only Alphabets are allowed).");
  }
  if (!validator.isAlpha(sanitizeLastName)) {
    res.json(400);
    throw new Error("Not valid Last Name.(Only Alphabets are allowed).");
  }
  const dobDate = new Date(sanitizeDob);
  if (!validator.isDate(dobDate) || dobDate >= new Date()) {
    res.json(400);
    throw new Error("Not valid Date of Birth.");
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      firstName: sanitizeFirstName,
      lastName: sanitizeLastName,
      dob: sanitizeDob,
      updatedAt: Date.now(),
    },
    { new: true }
  );
  if (updatedUser) {
    console.log(updatedUser);
    res.status(200);
    res.json({ updatedUser });
  } else {
    res.status(400);
    throw new Error("Not validated");
  }
});

//@desc Update profile
//@route PUT /profile/edit
//@access protected
const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, dob } = req.body;
  const userId = req.user.id;
  const sanitizeFirstName = sanitizeInput(firstName);
  const sanitizeLastName = sanitizeInput(lastName);
  const sanitizeDob = sanitizeInput(dob);
  const updatedProfileData = {};
  if (firstName != "") {
    if (!validator.isAlpha(sanitizeFirstName)) {
      res.json(400);
      throw new Error("Not valid First Name.(Only Alphabets are allowed).");
    }
    updatedProfileData["firstName"] = sanitizeFirstName;
  }
  if (lastName != "") {
    if (!validator.isAlpha(sanitizeLastName)) {
      res.json(400);
      throw new Error("Not valid Last Name.(Only Alphabets are allowed).");
    }
    updatedProfileData["lastName"] = sanitizeLastName;
  }
  if (dob != "") {
    const dobDate = new Date(sanitizeDob);
    if (!validator.isDate(dobDate) || dobDate >= new Date()) {
      res.json(400);
      throw new Error("Not valid Date of Birth.");
    }
    updatedProfileData["dob"] = sanitizeDob;
  }
  // console.log(updatedProfileData);
  const updatedUser = await User.findByIdAndUpdate(userId, updatedProfileData, {
    new: true,
  });
  // console.log(updatedUser);
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(400);
    throw new Error("Invalid profile");
  }
});

//@desc Create post
//@route POST /post/create
//@access protected
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const sanitizedTitle = sanitizeInput(title);
  const sanitizedContent = sanitizeInput(content);
  const newPost = await Post.create({
    title: sanitizedTitle,
    content: sanitizedContent,
    user: userId,
  });
  if (newPost) {
    res.status(200).json(newPost);
  } else {
    res.status(403);
    throw new Error("Invalid post");
  }
});

//@desc Get posts created by the authenticated user
//@route GET /posts/user
//@access protected
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userPosts = await Post.find({ user: userId });
  if (userPosts) {
    res.status(200).json(userPosts);
  } else {
    res.status(500);
    throw new Error("Unable to fetch posts");
  }
});

//@desc Create post
//@route GET /post/view
//@access protected
const viewPost = asyncHandler(async (req, res) => {
  const allPosts = await Post.find();
  if (allPosts) {
    res.status(200).json(allPosts);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

//@desc Create a new comment
//@route POST /comments/create
//@access protected
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;
  const sanitizedContent = sanitizeInput(content);
  const savedComment = await Comment.create({
    post: postId,
    user: userId,
    content: sanitizedContent,
  });
  if (savedComment) {
    res.status(200).json(savedComment);
  } else {
    res.status(500).json("Unable to create comment");
  }
});

//@desc Get comments for a specific post
//@route GET /comments/:postId
//@access protected
const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const postComments = await Comment.find({ post: postId });
  if (postComments) {
    res.status(200).json(postComments);
  } else {
    res.status(500).json("Unable to find comments");
  }
});

module.exports = {
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
};
