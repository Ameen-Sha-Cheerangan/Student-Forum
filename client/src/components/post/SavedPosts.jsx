import axios from 'axios';
import { useEffect, useState } from 'react';
import { SideBar } from '../Sidebar';
import { Post } from './Post';

const SavedPosts = ({ setModal, isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await axios.get(
      'http://localhost:8000/savedPosts',
      {
        headers: {
          Authorization: token,
        },
      },
    );
    setPosts(res.data);
  };

  return (
    <div className='flex min-h-screen  max-h-auto bg-[#191A21]  flex-col flex-grow lg:flex-row'>
      <SideBar />
      <div className='flex flex-col flex-grow mt-16 md:ml-32 bg-[#191A21] '>
        <h1 className='w-[70%] md:mx-auto mt-10 mb-9 text-5xl font-medium text-[#f6f7f9]'>
          Saved Posts
        </h1>
        {posts &&
          posts?.map((post) => (
            <Post
              key={post._id} // Use post._id as the unique key
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
export default SavedPosts;