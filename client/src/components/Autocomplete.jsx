import { useEffect, useState } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Autocomplete = ({ focus, topic, setTopic, refOne }) => {
  const [value, setValue] = useState(topic);
  const [data, setData] = useState([]);
  const [filtred, setFiltred] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFiltred(
      data.filter((option) =>
        option.category.toLowerCase().includes(value?.toLowerCase()),
      ),
    );
  }, [data, value, topic]);

  useEffect(() => {
    setValue(topic); // Update value when topic changes
  }, [topic]);

  const handleSelect = async (element) => {
    setTopic(element);
    setValue(element);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setTopic(e.target.value);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      `http://localhost:8000/categories`,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    );
    setData(res.data);
  };

  return (
    <div className='relative'>
      <div className='relative flex items-center'>
        <i className='absolute p-2 text-[#B6FFFA]'>
          <SearchSharpIcon />
        </i>

        <input
          value={value}
          type='text'
          placeholder='Choose a Department'
          onChange={handleChange}
          className=' pl-10 flex rounded-md bg-[#343944] text-[#f6f7f9] flex-grow h-9'
          ref={refOne}
        />
      </div>

      {focus && (
        <ul className='bg-[#343944] text-[#f6f7f9] absolute overflow-auto w-full p-2 z-10 border-gray-500 border '>
          {(username === 'Admin') && (

            <h1 className='flex justify-end text-blue-500    '>
              <span
                onClick={() => navigate('/createCategory')}
                className='hover:bg-gray-200 cursor-pointer px-1 rounded-md '
              >
                + CreateNew
              </span>
            </h1>
          )
          }
          {filtred?.map((option) => (
            <li
              className='border-b hover:text-blue-500 border-gray-200 p-2 cursor-pointer '
              key={option._id}
              onClick={() => handleSelect(option.category)}
            >
              {option.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
