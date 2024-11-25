import React, { useEffect, useRef, useState } from 'react';
import { SideBar } from '../Sidebar';
import { Autocomplete } from '../Autocomplete';
import { AutocompleteSub } from '../AutocompleteSub';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const CreatePost = () => {
  const location = useLocation();
  const refOne = useRef(null);
  const refTwo = useRef(null);
  const navigate = useNavigate(); // Use navigate hook

  const [disabled, setDisabled] = useState(true);
  const [focusOne, setFocusOne] = useState(false);
  const [focusTwo, setFocusTwo] = useState(false);
  const [topic, setTopic] = useState(location.state?.category || ''); // Prefill category
  const [subcategory, setSubcategory] = useState(location.state?.subcategory || ''); // Prefill subcategory
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (title && content && topic && subcategory) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [title, content, topic, subcategory]);

  const handleCloseSearch = (e) => {
    // If user clicks outside the input
    if (!refOne.current.contains(e.target)) {
      setFocusOne(false);
    } else {
      setFocusOne(true);
      setFocusTwo(false);
    }

    if (!refTwo.current.contains(e.target)) {
      setFocusTwo(false);
    } else {
      setFocusTwo(true);
      setFocusOne(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8000/createPost',
        {
          body: content,
          title: title,
          category: topic,
          subcategory: subcategory,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/${res.data.post.subcategory.replace(/\s+/g, '')}/${res.data.post._id}`);
      }
    } catch (error) {
      // Check if the error response exists and has a message
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show specific error message
      } else {
        toast.error('Apologies, currently facing some issue on our side. Try again later.');
      }
    }
  };

  return (
    <div onClick={handleCloseSearch} className='flex min-h-screen  max-h-auto bg-[#191A21]  flex-col flex-grow lg:flex-row'>
      {console.log('Topic:', topic)}
      {console.log('Subcategory:', subcategory)}
      <SideBar />
      <div className='flex flex-col flex-grow mt-16 pl-20'>
        <div className='w-full sm:w-[90%] md:w-[90%] lg:w-[70%] min-w-[300px] mt-5 mx-auto mx-2 pl-20' >
          <h1 className='text-2xl font-bold mb-3 text-[#f6f7f9]'>
            Create Post
          </h1>
          <div className='flex flex-col gap-5 mb-5'>
            <Autocomplete
              focus={focusOne}
              refOne={refOne}
              topic={topic}
              setTopic={setTopic}
            />
            <AutocompleteSub
              focus={focusTwo}
              refTwo={refTwo}
              topic={topic} // Ensure topic is passed
              subcategory={subcategory} // Pass subcategory explicitly
              setSubcategory={setSubcategory}
            />
          </div>
          <form
            onSubmit={submitHandler}
            className='flex flex-col rounded-md bg-[#23272F] mt-2 p-4 gap-3'
          >
            <input
              className='h-11 bg-[#343944] rounded-md text-[#f6f7f9] p-2'
              type='text'
              placeholder='Title'
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className='h-64 sm:h-72 md:h-80 bg-[#343944] rounded-md text-[#f6f7f9] p-2 resize-y'
              rows='10'
              type='text'
              placeholder='Write your post... Use $inline$ or $$block$$ for LaTeX equations'
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              disabled={disabled}
              className={`rounded-2xl mt-1 py-1 h-10 ${!disabled ? 'text-[#191a20] bg-[#B6FFFA] h-14 hover:opacity-90' : 'cursor-not-allowed h-14 bg-gray-400'}`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;