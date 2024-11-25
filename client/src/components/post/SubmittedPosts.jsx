import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SideBar } from '../Sidebar';
import { Post } from './Post';

const SubmittedPosts = ({ setModal, isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/submittedPosts',
        {
          headers: {
            Authorization: token,
          },
        },
      );
      const validPosts = res.data.filter(post => post !== null);

      setPosts(validPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <div className="flex min-h-screen  max-h-auto bg-[#191A21]  flex-col flex-grow lg:flex-row">
      <SideBar />
      <div className="flex flex-col flex-grow mt-16 md:ml-32 bg-[#191A21]">
        <h1 className="w-[70%] md:mx-auto mt-10 mb-9 text-5xl font-medium text-[#f6f7f9]">
          Your Posts
        </h1>
        {loading && <p className="text-[#f6f7f9]">Loading...</p>} {/* Display loading message */}
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        {posts && posts.length === 0 && !loading && !error && (
          <p className="w-[70%] md:mx-auto mb-9 text-xl font-semibold text-[#f6f7f9]">
            You haven't submitted any posts yet.
          </p>
        )}
        {posts && posts.length > 0 && posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            setModal={setModal}
            isLoggedIn={isLoggedIn}
            fetchData={fetchData}
          />
        ))}
      </div>
    </div>
  );
};

export default SubmittedPosts;
