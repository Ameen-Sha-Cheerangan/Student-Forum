import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';

export const SideBar = ({ submitHandler }) => {
  const [topics, setTopics] = useState([]);
  const [width, setWidth] = useState(15);
  const sidebarRef = useRef(null);
  const resizeRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchTopics();
  }, [submitHandler]);

  useEffect(() => {
    const resizeHandle = resizeRef.current;
    let startX;
    let startWidth;

    const startResize = (e) => {
      startX = e.clientX;
      startWidth = sidebarRef.current.offsetWidth;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    };

    const resize = (e) => {
      const newWidth = ((startWidth + (e.clientX - startX)) / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 40) { // Min 10%, Max 40%
        setWidth(newWidth);
      }
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };

    resizeHandle.addEventListener('mousedown', startResize);

    return () => {
      resizeHandle.removeEventListener('mousedown', startResize);
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  const fetchTopics = async () => {
    const res = await axios.get('http://localhost:8000/categories');
    setTopics(res.data);
  };

  const Topic = ({ data, level }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggle = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div key={data._id}>
        {data.subcategory && data.subcategory.length > 0 ? (
          <div onClick={toggle} className='flex items-end mt-5 mb-2 cursor-pointer'>
            <p className='font-semibold text-lg min-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
              {data.category}
            </p>
            <i className='text-2xl'>
              {isExpanded ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}
            </i>
          </div>
        ) : (
          <span className='flex items-end mt-5 mb-2 cursor-pointer font-semibold text-lg min-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
            {data.category}
          </span>
        )}
        {isExpanded &&
          data.subcategory?.map((child, index) => (
            <div
              key={index}
              className='mb-2 cursor-pointer hover:bg-[#343944] border border-[#343944] p-2 rounded-lg transition-all ease-in-out'
              onClick={() => navigate(`/${child}`)}
              style={{ marginLeft: `${level * 20}px` }}
            >
              {child}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${width}%` }}
      className='lg:overflow-auto min-h-screen hidden lg:block lg:border-gray-300 text-[#f6f7f9] rounded-lg bg-[#23272F] pt-6 pl-4 pr-4 pb-6 mt-10 fixed h-full transition-width duration-200'
    >
      <div
        ref={resizeRef}
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-[#343944] opacity-0 hover:opacity-100 transition-opacity duration-200"
      />

      {token && username === 'Admin' && (
        <div>
          <div className='gap-1 mb-1 p-1 hover:bg-[#343944] rounded-lg'>
            <i><AddSharpIcon /></i>
            <button className='mb-1 cursor-pointer p-2 transition-all ease-in-out mr-5' onClick={() => navigate('/createCategory')}>
              Add a Department
            </button>
          </div>
          <div className='gap-1 mb-1 p-1 hover:bg-[#343944] rounded-lg'>
            <i><AddSharpIcon /></i>
            <button className='mb-1 cursor-pointer p-2 rounded-lg transition-all ease-in-out mr-5' onClick={() => navigate('/createSubcategory')}>
              Add a Course
            </button>
          </div>
        </div>
      )}

      {topics.map((data) => (
        <Topic key={data._id} data={data} level={1} />
      ))}
    </div>
  );
};