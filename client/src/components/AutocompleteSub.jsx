import { useEffect, useState } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AutocompleteSub = ({ refTwo, focus, topic, subcategory, setSubcategory }) => {
  const [value, setValue] = useState(subcategory || '');
  console.log('Subcategory:', subcategory);
  const [data, setData] = useState([]);
  const [filtred, setFiltred] = useState([]);
  const username = localStorage.getItem('username');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter subcategories based on the selected topic
    const filteredCategories = data.find(
      (option) => option.category?.toLowerCase() === topic.toLowerCase()
    );

    if (filteredCategories) {
      setFiltred(filteredCategories.subcategory || []);
    } else {
      setFiltred([]);
    }
  }, [data, topic]);

  useEffect(() => {
    // Sync input value with the subcategory prop
    if (subcategory) {
      setValue(subcategory);
    }
  }, [subcategory]);

  const handleSelect = (element) => {
    setSubcategory(element);
    setValue(element);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setSubcategory(inputValue); // Update the parent state
  };


  const fetchCategories = async () => {
    const res = await axios.get(
      `http://localhost:8000/subcategories`,
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
          placeholder='Choose a Course'
          onChange={handleChange}
          className=' pl-10 flex  rounded-md bg-[#343944] text-[#f6f7f9]  flex-grow h-9'
          ref={refTwo}
        />
      </div>
      {focus && (
        <ul className='bg-[#343944] text-[#f6f7f9] absolute overflow-auto w-full p-2 z-10 border-gray-500 border '>
          {(username === 'Admin') && (
            <h1 className='flex justify-end text-blue-500    '>
              <span
                onClick={() => navigate('/createSubcategory')}
                className='hover:bg-gray-200 cursor-pointer px-1 rounded-md '
              >
                + CreateNew
              </span>
            </h1>)
          }
          {filtred?.map((option) => (
            <li
              className='border-b hover:text-blue-500 border-gray-200 p-2 cursor-pointer '
              key={option._id}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
