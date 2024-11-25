import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { toast } from 'react-hot-toast';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';

const processMath = () => {
  if (window.MathJax) {
    window.MathJax.typesetPromise().catch((err) =>
      console.error('MathJax processing failed:', err)
    );
  }
};

export const Comment = ({
  parentComment,
  comments,
  fetchComments,
  setModal,
}) => {
  const [isReply, setIsReply] = useState(false);
  const [comment, setComment] = useState('');
  const [disabled, setDisabled] = useState(true);

  const { postId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(parentComment.body);

  const handleEditToggle = () => setIsEditing(!isEditing);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  useEffect(() => {
    if (comment) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [comment]);
  useEffect(() => {
    processMath(); // Process MathJax for LaTeX
  }, [parentComment.body, isEditing]); // Run whenever the comment body or editing state changes

  const voteHandler = async (parentComment, voteType) => {
    if (!token) {
      return setModal(true);
    }
    await fetch('http://localhost:8000/commentVote', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        commentId: parentComment._id,
        voteType: voteType,
      }),
    }).then((res) => res.json());

    fetchComments();
  };
  const deleteHandler = async () => {
    if (parentComment.author._id !== userId && username !== 'Admin') {
      toast.error("You can only delete your own comments");
      return;
    }

    await fetch('http://localhost:8000/deleteComment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({
        commentId: parentComment._id,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message))
      .catch((err) => toast.error("An error occurred while deleting the comment"));

    fetchComments();
  };

  const subcomments = comments.filter(
    (element) => element.parentComment === parentComment._id,
  );

  const commentDate = () => {
    const commentDate = new Date(parentComment.createdAt);
    const currentDate = new Date();
    const hourDiff = Math.floor((currentDate - commentDate) / (1000 * 60 * 60));

    let timeAgo;
    if (hourDiff < 1) {
      const minuteDiff = Math.floor((currentDate - commentDate) / (1000 * 60));
      return (timeAgo = `${minuteDiff} minutes ago`);
    } else if (hourDiff < 24) {
      return (timeAgo = `${hourDiff} hours ago`);
    } else {
      const dayDiff = Math.floor(hourDiff / 24);
      return (timeAgo = `${dayDiff} days ago`);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!token) {
      return setModal(true);
    }

    const res = await axios.post(
      'http://localhost:8000/createComment',
      {
        body: comment,
        post: postId,
        parentCommentId: parentComment._id ? parentComment._id : null,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    toast.success(res.data.message);
    setComment('');
    setIsReply(false);
    fetchComments();
  };
  const submitEdit = async () => {
    console.log("Editing comment...");
    try {
      await axios.put(`http://localhost:8000/editComment/${parentComment._id}`,
        {
          body: editInput
        },
        {
          headers: { Authorization: token }
        });
      fetchComments(); // Refresh comments after editing
      setIsEditing(false); // Close edit mode
      processMath();
    } catch (error) {
      toast.error("An error occurred while editing the comment");
    }
  };
  return (
    <div className='flex flex-col border-l-2 border-gray-500 text-[#f6f7f9] '>
      <div className='border border-l-0 border-gray-500 flex p-1 mb-2'>
        <div
          onClick={(e) => e.stopPropagation()}
          className='bg-[#1f2229] flex flex-col justify-center text-center p-2 '
        >
          <button
            className='hover:bg-[#343944]'
            onClick={() => {
              voteHandler(parentComment, 'upvote');
            }}
          >
            {parentComment.votedBy[
              parentComment.votedBy.findIndex(
                (element) => element.user === userId,
              )
            ]?.voteType === 'upvote' && token ? (
              <i className='text-2xl text-green-200 '>
                <ThumbUpIcon />
              </i>
            ) : (
              <i className='text-2xl  '>
                <ThumbUpOutlinedIcon />
              </i>
            )}
          </button>

          <span className='font-semibold'> {parentComment.vote} </span>
          <button
            className='hover:bg-[#343944]'
            onClick={() => {
              voteHandler(parentComment, 'downvote');
            }}
          >
            {parentComment.votedBy[
              parentComment.votedBy.findIndex(
                (element) => element.user === userId,
              )
            ]?.voteType === 'downvote' && token ? (
              <i className='text-2xl  text-red-200 '>
                <ThumbDownIcon />
              </i>
            ) : (
              <i className='text-2xl  '>
                <ThumbDownOutlinedIcon />
              </i>
            )}
          </button>
        </div>
        <div className='lg:w-[95%] md:w-[95%] sm:w-[95%] w-full'>
          <div className='flex  items-center'>
            <div className='font-semibold text-sm box-border border-b border-transparent  transition-all  ease-in-out rounded-lg px-1 mr-5 ml-1' style={{ alignItems: 'center' }}
            >{parentComment.author.username}</div> {/* Display author of the comment */}
            <div className='text-xs'>{commentDate()}</div>
          </div>
          <div className="ml-2" >
            {isEditing ? (
              <textarea
                className='border bg-[#343944] border-gray-500 p-2 w-full rounded-lg resize-none'
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                rows="3" // Initial rows for the textarea
                onInput={(e) => {
                  e.target.style.height = 'auto'; // Reset height to auto
                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
                }}
                onFocus={(e) => {
                  e.target.style.height = 'auto'; // Reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust when focused
                }}
                placeholder="Edit your comment... Use $inline$ or $$block$$ for LaTeX equations"
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: parentComment.body }}
                className='latex-comment'
              />
            )}
          </div>
          <section className='flex p-2'>
            <div
              onClick={() => setIsReply(!isReply)}
              className='flex hover:bg-[#343944] rounded-lg p-2 transition-all  ease-in-out'
            >
              <div className='flex text-center justify-center items-center pr-1 opacity-80 '>
                <i>
                  <ChatBubbleOutlineOutlinedIcon />
                </i>
                <button className=''>Reply</button>
              </div>
            </div>

            {(parentComment.author._id === userId || username === 'Admin') && (
              <div
                className='flex hover:bg-[#343944] rounded-lg p-2 transition-all  ease-in-out'
                onClick={deleteHandler}
              >
                <div className='flex text-center justify-center items-center pr-1 '>
                  <i className='opacity-80'>
                    <DeleteSharpIcon />
                  </i>
                  <button className=''>Delete</button>
                </div>
              </div>
            )}
            {userId === parentComment.author._id && (
              <div onClick={isEditing ? submitEdit : handleEditToggle} className="flex hover:bg-[#343944] rounded-lg p-2 transition-all ease-in-out">

                <i className="flex text-center justify-center items-center pr-1 opacity-95">
                  {isEditing ? <SaveSharpIcon /> : <EditSharpIcon />}
                </i>
                <p>{isEditing ? 'Update' : 'Edit'}</p>
              </div>
            )}
          </section>

        </div>
      </div>
      {
        isReply && (
          <form
            onSubmit={submitHandler}
            className='flex justify-center flex-col p-2'
          >
            <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className='border bg-[#343944]  border-gray-500 p-2'
              cols='70'
              rows='5'
              placeholder='Share your thoughts... Use $inline$ or $$block$$ for LaTeX equations'
            ></textarea>
            <div className='flex justify-end'>
              <button
                disabled={disabled}
                className={` bg-[#B6FFFA] text-[#191a20]  rounded-lg mt-2 py-2 px-4 ${!disabled
                  ? '  hover:opacity-90'
                  : 'cursor-not-allowed opacity-75 '
                  }`}
              >
                Reply
              </button>
            </div>
          </form>
        )
      }

      {
        subcomments.length > 0 && (
          <div style={{ marginLeft: `${parentComment.depth + 20}px` }}>
            {subcomments.map((subcomment) => (
              <Comment
                key={subcomment._id}
                parentComment={subcomment}
                comments={comments}
                fetchComments={fetchComments}
              />
            ))}
          </div>
        )
      }
    </div >
  );
};