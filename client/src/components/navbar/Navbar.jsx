import { Link, useNavigate } from 'react-router-dom';
import { User } from './User';
import { useState } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import NitcIcon from '/NitcLogo.svg';

export const Navbar = ({
  isLoggedIn,
  setIsLoggedIn,
  modal,
  setModal,
  refOne,
  focusOne,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    if (!searchInput) {
      return;
    }
    e.preventDefault();
    navigate(`search/${searchInput}`);
    setSearchInput('');
  };
  return (
    <nav className='h-14 bg-[#23272F] border-b border-gray-600 text-[#f6f7f9] flex justify-between px-3  items-center  fixed w-full z-10'>
      <Link className='text-lg' to='/'>
        <div className='flex gap-1 justify-center items-center'>
          <div className='flex justify-center text-2xl items-center text-[#B6FFFA]'>
            <img className="project-img" src={NitcIcon} style={{ width: '70%', maxWidth: '50px', height: 'auto' }} />          </div>

          <h1 className='hidden sm:block text-xl font-bold text-[#f6f7f9]'>
            Knowledge Flow
          </h1>
        </div>
      </Link>
      {(isLoggedIn ? (
        <form onSubmit={submitHandler}>
          <div className='flex relative'>
            <input
              type='text'
              value={searchInput}
              placeholder='Search'
              onChange={(e) => setSearchInput(e.target.value)}
              className=' shadow-md outline-blue-400 hover:border-blue-400 border-gray-600 border rounded-xl h-6 p-4 bg-[#343944] w-[300px] lg:w-[800px] xs:w-[200px] '
            />
            <button className=' absolute right-2 top-0 bottom-0'>
              <i className='text-[#B6FFFA]'>
                <SearchSharpIcon />
              </i>
            </button>
          </div>
        </form>
      ) : (<div />))}

      <div className='flex items-center gap-5'>
        {!isLoggedIn && (
          <button
            onClick={() => setModal(true)}
            className='hidden max-h-[38px] md:block hover:brightness-90 bg-[#B6FFFA] text-[15px] font-bold  rounded-2xl px-3 py-2 text-[#191a20] shadow-md'
          >
            Log In
          </button>
        )}

        <User
          focusOne={focusOne}
          refOne={refOne}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          modal={modal}
          setModal={setModal}
        />
      </div>
    </nav>
  );
};
