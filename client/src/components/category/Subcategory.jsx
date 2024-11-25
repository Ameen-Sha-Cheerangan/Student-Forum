import { useEffect, useState } from 'react';
import { SideBar } from '../Sidebar';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../post/Post';
import AddSharpIcon from '@mui/icons-material/AddSharp';

const Subcategory = ({ setModal, isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const { subcategory } = useParams();

  useEffect(() => {
    fetchData();
    fetchCategory(); // Call fetchCategory here
  }, [subcategory]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:8000/sub/${subcategory}`,
    );
    setPosts(res.data);
  };
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/categories`);
      const categories = res.data;

      // Find the category that contains the current subcategory
      const matchedCategory = categories.find((cat) =>
        cat.subcategory.includes(subcategory),
      );

      if (matchedCategory) {
        setCategory(matchedCategory.category); // Set the category dynamically
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  return (
    <div className='flex min-h-screen  max-h-auto bg-[#191A21]  flex-col flex-grow lg:flex-row  '>
      <SideBar />

      <div className='flex flex-col flex-grow mt-16 md:ml-32 bg-[#191A21] '>
        <Link to="/createPost"
          state={{ category, subcategory }} // Pass both category and subcategory
          className="p-5">
          <div className='flex h-11 bg-[#23272F] border   border-gray-600 md:w-[650px] md:m-auto'>
            <i className='flex justify-center items-center text-[#f6f7f9] p-3'>
              <AddSharpIcon />
            </i>
            <input
              type='text'
              placeholder='Create Post'
              className='hover:border-gray-500 bg-[#343944] border border-gray-600 w-full mr-4 my-1 px-3 py-1'
            />
          </div>
        </Link>
        <h1 className='w-[70%] md:mx-auto mb-9 text-5xl font-medium  text-[#f6f7f9]'>
          {subcategory}
        </h1>
        {posts.map((post) => (
          <Post
            key={post._id} // Use a unique identifier for each post

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
export default Subcategory;
