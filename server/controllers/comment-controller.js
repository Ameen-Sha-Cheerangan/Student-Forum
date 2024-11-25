const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");

exports.createComment = async (req, res) => {
  const { username, _id } = req.user;
  const { body, post, parentCommentId } = req.body;
  try {
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      const relatedPost = await PostModel.findById(post);
      const newSubcomment = await new CommentModel({
        body,
        post,
        author: _id,
        username,
        parentComment: parentCommentId,
        depth: parentComment.depth + 1,
      });
      const savedSubcomment = await newSubcomment.save();

      parentComment.subcomments.push(newSubcomment);
      relatedPost.comments.push(newSubcomment._id);

      await relatedPost.save();

      await parentComment.save();
      res
        .status(201)
        .json({ savedSubcomment, message: "Subcomment created successfully" });
      return;
    }

    const relatedPost = await PostModel.findById(post);
    const comment = await new CommentModel({
      body,
      post,
      author: _id,
      username,
      parentComment: null,
    });
    relatedPost.comments.push(comment._id);

    await relatedPost.save();
    await comment.save();
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

exports.editComment = async (req, res) => {
  const { id } = req.params; // Get comment ID from URL parameters
  const { body } = req.body; // Get new body from request body
  const userId = req.user._id; // Get user ID from token

  try {
    const comment = await CommentModel.findById(id); // Find comment by ID
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== userId.toString())
      return res.status(403).json({ message: "Unauthorized action" });

    comment.body = body; // Update comment body
    await comment.save(); // Save updated comment
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await CommentModel.find({ post: postId })
      .populate("author", "username") // This populates the 'author' field with the 'username' field
      .exec();
    res.status(200).json(comments);
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

exports.commentVote = async (req, res) => {
  const { commentId, voteType } = req.body;
  const user = req.user;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingVote = comment.votedBy.find((obj) => obj.user === user._id.toString());

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote (undo action)
        comment.vote += voteType === "upvote" ? -1 : 1;
        comment.votedBy = comment.votedBy.filter((obj) => obj.user !== user._id.toString());
      } else {
        // Switch vote type
        comment.vote += voteType === "upvote" ? 2 : -2;
        existingVote.voteType = voteType;
      }
    } else {
      // New vote
      comment.vote += voteType === "upvote" ? 1 : -1;
      comment.votedBy.push({ user: user._id, voteType });
    }

    await comment.save();
    res.status(200).json({ comment, message: "Comment updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId, postId } = req.body;

  try {
    // If commentId is not provided or is not a string, delete all comments for the post
    if (!commentId || typeof commentId !== "string") {
      await CommentModel.deleteMany({ post: postId });
      return res.status(200).json({ message: "All comments deleted successfully" });
    }

    // Recursive function to delete subcomments
    const subcommentDelete = async (commentId) => {
      const comment = await CommentModel.findById(commentId);
      if (!comment) return; // If comment doesn't exist, exit

      // Delete all subcomments recursively
      for (const subcommentId of comment.subcomments) {
        await subcommentDelete(subcommentId);
      }

      // Remove the comment from the post's comments array
      await PostModel.updateOne({ _id: postId }, { $pull: { comments: commentId } });
      // Delete the comment
      await CommentModel.findByIdAndDelete(commentId);
    };

    // Start deletion process with the provided comment ID
    await subcommentDelete(commentId);

    return res.status(200).json({ message: "Comment and its subcomments deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
