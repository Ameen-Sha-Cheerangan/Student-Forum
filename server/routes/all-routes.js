const express = require("express");
const { protect } = require("../middleware/auth-middleware");

const router = express.Router();

//Controllers
const { register, login } = require("../controllers/auth-controller");
const {
  createPost,
  getAllPosts,
  vote,
  savePost,
  getUser,
  getOnePost,
  getOneSubCategory,
  getSavedPosts,
  getSubmittedPosts,
  getSearchedPost,
  deletePost,
  editPost, // Import the editPost function
} = require("../controllers/post-controller");
const {
  createCategory,
  createSubcategory,
  getAllCategories,
  getAllSubcategories,
} = require("../controllers/category-controller");
const {
  createComment,
  editComment,
  getComments,
  commentVote,
  deleteComment,
} = require("../controllers/comment-controller");

// Authentication routes
router.post("/login", login);
router.post("/register", register);

// Post routes
router.post("/createPost", protect, createPost);
router.put("/editPost/:postId", protect, editPost); // Add the editPost route
router.get("/", getAllPosts);
router.get("/posts/:sortType", getAllPosts);
router.get("/post/:postId", getOnePost);
router.delete("/deletePost", protect, deletePost);
router.put("/vote", protect, vote);
router.put("/savePost", protect, savePost);

// Category and Subcategory routes
router.post("/createCategory", protect, createCategory);
router.post("/createSubcategory", protect, createSubcategory);
router.get("/categories", getAllCategories);
router.get("/subcategories", getAllSubcategories);
router.get("/sub/:subcategory", getOneSubCategory);

// User and saved posts routes
router.get("/user", protect, getUser);
router.get("/savedPosts", protect, getSavedPosts);
router.get("/submittedPosts", protect, getSubmittedPosts);
router.get("/search/:query", getSearchedPost);

// Comment routes
router.post("/createComment", protect, createComment);
router.put("/editComment/:id", protect, editComment);
router.get("/comments/:postId", getComments);
router.put("/deleteComment", protect, deleteComment);
router.put("/commentVote", protect, commentVote);

module.exports = router;
