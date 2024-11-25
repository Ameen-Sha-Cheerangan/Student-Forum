import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';

const processMath = () => {
  if (window.MathJax) {
    window.MathJax.typesetPromise().catch((err) =>
      console.error('MathJax processing failed:', err)
    );
  }
};

export const Post = ({ post, isLoggedIn, setModal, fetchData, isSubmit }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const [editTitle, setEditTitle] = useState(post.title); // Editable title
  const [editBody, setEditBody] = useState(post.body); // Editable body
  let isAuthor = isLoggedIn && post.author;
  // const isAuthor =  isLoggedIn && post.author &&(userId === post.author.toString());

  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    isSaved();
  }, [fetchData]);
  useEffect(() => {
    processMath(); // Reprocess LaTeX for the post body
  }, [post.body]);
  const isSaved = async () => {
    if (token) {
      await fetch('http://localhost:8000/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => setSavedPosts(data.savedPosts));
    }
  };

  const postDate = (post) => {
    const postDate = new Date(post.createdAt);
    const currentDate = new Date();
    const hourDiff = Math.floor((currentDate - postDate) / (1000 * 60 * 60));

    let timeAgo;
    if (hourDiff < 1) {
      const minuteDiff = Math.floor((currentDate - postDate) / (1000 * 60));
      return (timeAgo = `${minuteDiff} minutes ago`);
    } else if (hourDiff < 24) {
      return (timeAgo = `${hourDiff} hours ago`);
    } else {
      const dayDiff = Math.floor(hourDiff / 24);
      return (timeAgo = `${dayDiff} days ago`);
    }
  };
  const voteHandler = async (post, voteType) => {
    if (!isLoggedIn) {
      return setModal(true);
    }
    await fetch('http://localhost:8000/vote', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        postId: post._id,
        voteType: voteType,
      }),
    }).then((res) => res.json());

    fetchData();
  };
  const saveHandler = async (post) => {
    if (!isLoggedIn) {
      return setModal(true);
    }
    await fetch('http://localhost:8000/savePost', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        postId: post._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message));

    fetchData();
  };

  const deleteHandler = async (post) => {
    await fetch('http://localhost:8000/deletePost', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        postId: post._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message));

    fetchData();
    await fetch('http://localhost:8000/deleteComment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({
        commentId: post.comments,
        postId: post._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message));
  };
  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editBody) {
      toast.error('Title and Body are required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/editPost/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ title: editTitle, body: editBody }),
      });

      if (response.ok) {
        toast.success('Post updated successfully');
        setIsEditing(false); // Exit editing mode
        fetchData(); // Refresh data
        setTimeout(() => {
          processMath(); // Ensure MathJax re-renders after UI update
        }, 0);
      } else {
        toast.error('Failed to update the post');
      }
    } catch (error) {
      toast.error('An error occurred while updating the post');
    }
  };


  return (
    <div className='x'>
      {/* <div>
        <h4>Debug Information:</h4>
        <p><strong>isLoggedIn:</strong> {JSON.stringify(isLoggedIn)}</p>
        <p><strong>Post Author:</strong> {JSON.stringify(post.author)}</p>
        <p><strong>User Id:</strong> {JSON.stringify(userId)}</p>
        <p><strong>Both are same</strong> {JSON.stringify(userId === post.author)}</p>

      </div> */}
      {post && savedPosts && (
        <div
          onClick={() => {
            if (
              location.pathname !==
              `${post.subcategory.replace(/\s+/g, '')}/${post._id}`
            ) {
              navigate(`/${post.subcategory.replace(/\s+/g, '')}/${post._id}`);
            }
          }}
          key={post._id}
          className=' hover:border-gray-500  transition-all  ease-in-out  flex justify-start  cursor-pointer mb-5 border-gray-600 border bg-[#23272F] text-[#f6f7f9] w-[70%] md:mx-auto'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='bg-[#1f2229] flex flex-col justify-center text-center p-2'
          >
            <button
              className='hover:bg-[#343944] transition-all  ease-in-out rounded-lg p-1'
              onClick={() => {
                voteHandler(post, 'upvote');
              }}
            >
              {post.votedBy[
                post.votedBy.findIndex((element) => element.user === userId)
              ]?.voteType === 'upvote' && isLoggedIn ? (
                <i className='text-2xl text-green-200     '>
                  <ThumbUpIcon />
                </i>
              ) : (
                <i className='text-2xl text-[#f6f7f9] '>
                  <ThumbUpOutlinedIcon />
                </i>
              )}
            </button>

            <span className='font-semibold'> {post.vote} </span>
            <button
              className='hover:bg-[#343944]  transition-all  ease-in-out rounded-lg p-1 '
              onClick={() => {
                voteHandler(post, 'downvote');
              }}
            >
              {post.votedBy[
                post.votedBy.findIndex((element) => element.user === userId)
              ]?.voteType === 'downvote' && isLoggedIn ? (
                <i className='text-2xl text-red-200'>
                  <ThumbDownIcon />
                </i>
              ) : (
                <i className='text-2xl text-[#f6f7f9] '>
                  <ThumbDownOutlinedIcon />
                </i>
              )}
            </button>
          </div>
          <section className='p-2 ' style={{ width: '100%' }}>
            <div className='flex' style={{ alignItems: 'center' }}>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${post.subcategory}`);
                }}
                className='font-semibold text-sm box-border border-b border-transparent hover:bg-[#343944] transition-all  ease-in-out rounded-lg px-1 '
                style={{ color: "#B6FFFA", alignItems: 'center' }}
              >
                {post.subcategory}
              </p>
              <p className='text-xs font-light ml-5'>
                Posted by <span className='text-#ffffff font-semibold'>{post.username}</span>
              </p>
              <p className='text-xs font-light ml-5'>{postDate(post)} </p>
            </div>
            {isEditing ? (
              <form onSubmit={submitEdit} className="flex flex-col gap-3 mt-3 mb-2">
                <input
                  className="border border-gray-500 h-11 bg-[#343944] rounded-md text-[#f6f7f9] p-2"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  required
                />
                <textarea
                  className="border border-gray-500 h-44 bg-[#343944] rounded-md text-[#f6f7f9] p-2 resize-none"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  onInput={(e) => {
                    e.target.style.height = 'auto'; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content
                  }}
                  onFocus={(e) => {
                    e.target.style.height = 'auto'; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust when focused
                  }}
                  placeholder="Body"
                  rows="5"
                  required
                />

              </form>
            ) : (
              <>
                <p className="text-xl mt-1 mb-2">{post.title}</p>
                <div
                  dangerouslySetInnerHTML={{ __html: post.body }}
                  className="font my-1 bg-[#343944] p-2 rounded-lg"
                ></div>
              </>
            )}

            <div className='flex  gap-3 opacity-80'>
              <div
                className='flex hover:bg-[#343944] rounded-lg p-2 transition-all  ease-in-out'
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    location.pathname !==
                    `${post.subcategory.replace(/\s+/g, '')}/${post._id}`
                  ) {
                    navigate(
                      `/${post.subcategory.replace(/\s+/g, '')}/${post._id}`,
                    );
                  }
                }}
              >
                <i className='flex text-center justify-center items-center pr-1 opacity-95'>
                  <ChatBubbleOutlineOutlinedIcon />
                </i>
                <p>{post.comments.length} Comments</p>
              </div>
              <div
                className='flex hover:bg-[#343944] rounded-lg p-2 transition-all  ease-in-out'
                onClick={(e) => {
                  e.stopPropagation();
                  saveHandler(post);
                }}
              >
                {savedPosts && savedPosts.includes(post._id) ? (
                  <>
                    <i className='flex text-center justify-center items-center pr-1 opacity-95'>
                      <BookmarkIcon />
                    </i>
                    <p>Unsave</p>
                  </>
                ) : (
                  <>
                    <i className='flex text-center justify-center items-center pr-1 opacity-95'>
                      <BookmarkBorderOutlinedIcon />
                    </i>
                    <p>Save</p>
                  </>
                )}
              </div>
              {isAuthor && (userId === post.author) &&
                <div
                  className='flex hover:bg-[#343944] rounded-lg p-2 transition-all ease-in-out'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditing) {
                      submitEdit(e); // Trigger the save logic
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  <i className='flex text-center justify-center items-center pr-1 opacity-95'>
                    {isEditing ? <SaveSharpIcon /> : <EditSharpIcon />}
                  </i>
                  <p>{isEditing ? 'Update' : 'Edit'}</p>
                </div>
              }
            </div>
          </section>
          {
            isAuthor && (userId === post.author || username === 'Admin') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandler(post);
                }}
                className='ml-auto w-10 bg-red-600 flex justify-center items-center '
              >
                <i className='opacity-75'>
                  <HighlightOffSharpIcon />
                </i>
              </button>
            )
          }
        </div >
      )
      }
    </div >
  );
};
