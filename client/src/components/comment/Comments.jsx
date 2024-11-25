import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Comment } from './Comment';
import { toast } from 'react-hot-toast';

export const Comments = ({ setModal, comments, fetchComments }) => {
  const { postId } = useParams();

  const [parentInput, setParentInput] = useState('');
  const [parentCommentId, setParentCommentId] = useState('');
  const [disabled, setDisabled] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComments();
  }, []);
  useEffect(() => {
    if (parentInput) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [parentInput]);

  const parentComments = comments.filter((comment) => !comment.parentComment);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!token) {
      return setModal(true);
    }
    const res = await axios.post(
      'http://localhost:8000/createComment',
      {
        body: parentInput,
        post: postId,
        parentCommentId: parentCommentId ? parentCommentId : null,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    toast.success(res.data.message);
    setParentInput('');
    fetchComments();
  };

  return (
    <div className='w-[70%] md:mx-auto md:p-3 bg-[#23272F] text-[#f6f7f9]  '>
      <form
        onSubmit={submitHandler}
        className='flex justify-center flex-col mb-3'
      >
        <textarea
          onChange={(e) => setParentInput(e.target.value)}
          className='border bg-[#343944]  border-gray-500 p-2'
          value={parentInput}
          cols='70'
          rows='5'
          placeholder='Share your thoughts... Use $inline$ or $$block$$ for LaTeX equations'
        ></textarea>
        <div className='flex justify-end'>
          <button
            disabled={disabled}
            className={`bg-[#B6FFFA] text-[#191a20]  py-2 px-4 mt-2 rounded-lg  ${!disabled
              ? '     hover:opacity-90'
              : 'cursor-not-allowed  opacity-75  '
              }`}
          >
            Submit
          </button>
        </div>
      </form >
      <div>
        {parentComments.map((parentComment) => (
          <Comment
            key={parentComment._id} // Use unique ID for the key
            setModal={setModal}
            parentComment={parentComment}
            comments={comments}
            fetchComments={fetchComments}
            postId={postId}
          />
        ))}
      </div>
    </div >
  );
};