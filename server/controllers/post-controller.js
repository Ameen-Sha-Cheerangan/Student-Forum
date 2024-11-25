const CategoryModel = require('../models/CategoryModel');
const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');

exports.createPost = async (req, res) => {
  const { body, category, subcategory, title } = req.body;//Extract the required fields from the request body
  const { username } = req.user;//Extract the username from the user object
  const author = req.user;//The authenticated user is the author of the post

  try {
    //Check if the category and subcategory exist
    const isSubExist = await CategoryModel.find({
      category: category,
      subcategory: subcategory,
    });
    if (isSubExist.length === 0) {
      throw new Error();
    }
    //Create a new post
    const post = await new PostModel({
      username,
      body,
      title,
      category,
      subcategory,
      author,
    });
    //Save the post to the database
    await post.save();
    const user = await UserModel.findOne({ username: post.username });
    user.submittedPosts.push(post._id);
    await user.save();

    // Return the created post along with success message
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: post // Include the created post
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'There is no category or subcategory like this',
    });
  }
};

exports.editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, body } = req.body;

  // Check if user is authorized to edit the post
  const post = await PostModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to edit this post' });
  }

  // Update the post
  post.title = title || post.title;
  post.body = body || post.body;

  try {
    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.body;
  try {
    //Find the post by its ID
    const post = await PostModel.findById({ _id: postId });
    //Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    //Delete the post
    if (post) {
      await PostModel.deleteOne({ _id: postId });
      return res.status(200).json({ message: 'Post deleted successfully' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  const { sortType } = req.params;
  // const limit = parseInt(req.query.limit) || 10; // Default to 10 posts
  // const page = parseInt(req.query.page) || 1;   // Default to page 1
  // const skip = (page - 1) * limit;
  try {
    if (sortType === 'popular') {
      const posts = await PostModel.find().sort({ vote: -1 });
      return res.status(200).json(posts);
    }
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.vote = async (req, res) => {
  const { postId, voteType } = req.body;// Extract the postId and voteType from the request body
  const user = req.user;// Extract the user object from the request

  try {
    const post = await PostModel.findById(postId);// Find the post by its ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const existingVote = post.votedBy.find((obj) => obj.user === user._id.toString());
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if it's the same (undo action)
        post.vote += voteType === 'upvote' ? -1 : 1;
        post.votedBy = post.votedBy.filter((obj) => obj.user !== user._id.toString());
      } else {
        // Switch vote type (upvote to downvote or vice versa)
        post.vote += voteType === 'upvote' ? 2 : -2;
        existingVote.voteType = voteType;
      }
    } else {
      // New vote
      post.vote += voteType === 'upvote' ? 1 : -1;
      post.votedBy.push({ user: user._id, voteType });
    }
    await post.save();// Save the updated post
    res.status(200).json({ post, message: 'Vote updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  const { postId } = req.body;
  const user = req.user;
  try {
    const post = await PostModel.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (user.savedPosts.includes(postId)) {
      const index = user.savedPosts.indexOf(postId);//Find the index of the post in the array
      user.savedPosts.splice(index, 1);//Remove the post from the array
      await user.save();//Save the updated user
      return res.status(200).json({ user, message: 'Post unsaved' });
    }
    user.savedPosts.push(postId);
    await user.save();
    res.status(200).json({ message: 'Post saved' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { savedPosts } = req.user;
    res.status(200).json({ savedPosts: savedPosts });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getOnePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findById({ _id: postId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
};

exports.getOneSubCategory = async (req, res) => {
  const { subcategory } = req.params;
  try {
    const posts = await PostModel.find({ subcategory: subcategory });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
};

exports.getSavedPosts = async (req, res) => {
  const user = req.user;
  try {
    const postIds = user.savedPosts;//Get the array of saved posts
    const posts = await Promise.all(
      postIds.map((postId) => PostModel.findById(postId)),
    );// Fetch details for each saved post ID.
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

exports.getSubmittedPosts = async (req, res) => {
  const user = req.user;
  try {
    const postIds = user.submittedPosts;//Get the array of submitted posts
    const posts = await Promise.all(
      postIds.map((postId) => PostModel.findById(postId)),
    );// Fetch details for each submitted post ID.
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
};

exports.getSearchedPost = async (req, res) => {
  const { query } = req.params;
  try {
    const posts = await PostModel.find({
      $or: [
        { body: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
      ],
    });
    if (posts.length <= 0) {
      return res
        .status(404)
        .json({ message: `Hm... we couldn't find any results for ${query}` });
    }
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
