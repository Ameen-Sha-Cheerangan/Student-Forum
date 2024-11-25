import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { FaXmark } from 'react-icons/fa6';

export const User = ({
  isLoggedIn,
  setIsLoggedIn,
  modal,
  setModal,
  refOne,
  focusOne,
}) => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState(''); // Add state for email
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notify, setNotify] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login', {
        username: username,
        password: password,
      });

      if (res.data.success === true) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('userId', res.data.userId);

        navigate(0); // force refresh
      }
    } catch (error) {
      // Check if the error response exists and has a message
      if (error.response && error.response.data && error.response.data.error) {
        setNotify(error.response.data.error); // Show specific error message
      } else {
        setNotify('Apologies, currently facing some issue on our side. Try again later.');
      }
    }
  };
  const registerHandler = async (e) => {
    e.preventDefault();

    // Check for valid email domain
    const emailDomain = /@nitc\.ac\.in$/;
    if (!emailDomain.test(email)) {
      return setNotify('Email is not valid');
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return setNotify('Passwords do not match');
    }

    if (password.length < 6) {
      return setNotify('Password must be at least 6 characters long.');
    }


    try {
      const res = await axios.post('http://localhost:8000/register', {
        username: username,
        password: password,
        email: email, // Include email in the payload
      });

      if (res.data.success === true) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('userId', res.data.user._id);
        navigate(0); // force refresh
      }
    } catch (error) {
      // Handle different error messages based on the response
      if (error.response && error.response.data) {
        setNotify(error.response.data.message || 'Registration failed');
      } else {
        setNotify('Apologies, currently facing some issue on our side. Try again later.');
      }
    }
  };


  return (
    <>
      <div>
        <div className='relative inline-block'>
          <div
            ref={refOne}
            className='flex gap-1 border transition-all ease-in-out border-[#23272F] hover:border-gray-500 rounded-xl p-1 hover justify-center items-center cursor-pointer'
          >
            <i className='text-[#B6FFFA]'>
              <PersonIcon />
            </i>

            <p className=' p-1 text-[16px]  font font-medium hidden sm:block'>
              {isLoggedIn ? localStorage.getItem('username') : 'User Profie'}
            </p>
          </div>
          {focusOne && (
            <div className='  rounded-lg bg-[#23272F]  border border-gray-600  p-1 w-36 right-0 mt-2  absolute z-50'>
              {isLoggedIn ? (
                <div>
                  <div
                    className='cursor-pointer hover:bg-[#343944] p-2 rounded-lg'
                    onClick={() => navigate('/savedPosts')}
                  >
                    Saved Posts
                  </div>
                  <div
                    className='cursor-pointer hover:bg-[#343944] p-2 rounded-lg'
                    onClick={() => navigate('/submittedPosts')}
                  >
                    Your Posts
                  </div>
                  <div
                    className='cursor-pointer hover:bg-[#343944] p-2 rounded-lg'
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('username');
                      localStorage.removeItem('userId');
                      navigate('/');
                      navigate(0);
                    }}
                  >
                    Log Out
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setModal(true);
                    setLogin(true);
                  }}
                  className='cursor-pointer hover:bg-[#343944] p-1'
                >
                  Log In / Sign Up
                </div>
              )}
            </div>
          )}
          {modal && (
            <div className='z-10 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
              <div className='bg-[#23272F] rounded-lg p-12 flex flex-col h-[600px] w-[500px] relative'>
                <button
                  onClick={() => setModal(false)}
                  className='absolute text-2xl top-3 right-3 text-[#f6f7f9] hover:bg-gray-600 transition-all ease-in-out rounded-full p-2'
                >
                  <FaXmark />
                </button>
                {login && (
                  <form onSubmit={loginHandler} className='flex flex-col gap-4'>
                    <h1 className='text-2xl font-bold mb-14'>Log In</h1>
                    <input
                      className={` shadow-md rounded-lg h-14 p-4 bg-[#343944] hover:border-gray-400 border border-[#343944] ${notify && 'border border-red-500 hover:border-red-500 '
                        }  placeholder:text-sm`}
                      type='text'
                      placeholder='Username'
                      value={username}
                      required
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setNotify('');
                      }}
                    />
                    {notify && (
                      <div className='pl-4 text-sm text-red-500'>{notify}</div>
                    )}
                    <input
                      className={` shadow-md rounded-lg h-14 p-4 bg-[#343944] hover:border-gray-400 border border-[#343944] ${notify && 'border-red-500 hover:border-red-500'
                        }  placeholder:text-sm`}
                      placeholder='Password'
                      type='password'
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setNotify('');
                      }}
                    />
                    <button className='bg-[#B6FFFA] text-[#191a20] h-12 mt-4 rounded-3xl hover:opacity-90 py-1 font-bold'>
                      Log In
                    </button>
                    <p className='text-sm'>
                      New to Knowledge Flow?
                      <span
                        className='text-sm text-blue-600  cursor-pointer ml-1'
                        style={{ color: '#B6FFFA' }}
                        onClick={() => {
                          setLogin(false);
                          setUsername('');
                          setPassword('');
                          setNotify('');
                        }}
                      >
                        Sign Up
                      </span>
                    </p>
                  </form>
                )}
                {!login && (
                  <form
                    onSubmit={registerHandler}
                    className='flex flex-col gap-4'
                  >
                    <h1 className='text-2xl font-bold mb-14'>Sign Up</h1>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setNotify('');
                      }}
                      className={`shadow-md rounded-lg h-14 p-4 bg-[#343944] border border-[#343944] placeholder:text-sm ${notify.includes('Email') && 'border-red-500'}`}
                    />

                    <input
                      className={` shadow-md rounded-lg h-14 p-4 bg-[#343944] hover:border-gray-400 border border-[#343944] placeholder:text-sm ${notify === 'User already exists'
                        ? 'border-red-500 hover:border-red-500'
                        : ''
                        }`}
                      type='text'
                      placeholder='Username'
                      value={username}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className={` shadow-md rounded-lg h-14 p-4 bg-[#343944] hover:border-gray-400 border border-[#343944] ${notify === 'Password do not match'
                        ? 'border-red-500 hover:border-red-500'
                        : ''
                        }  placeholder:text-sm`}
                      placeholder='Password'
                      type='password'
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setNotify('');
                      }}
                    />
                    <input
                      className={`  shadow-md rounded-lg h-14 p-4 bg-[#343944] hover:border-gray-400 border-[#343944] border ${notify === 'Password do not match'
                        ? 'border-red-500 hover:border-red-500'
                        : ''
                        }  placeholder:text-sm`}
                      placeholder='Confirm Password'
                      type='password'
                      value={confirmPassword}
                      required
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setNotify('');
                      }}
                    />
                    {notify && (
                      <div className='text-sm text-red-500'>{notify}</div>
                    )}
                    <button className='bg-[#B6FFFA] text-[#191a20] font-bold h-12 mt-4 rounded-3xl hover:opacity-90 py-1'>
                      Sign up
                    </button>
                    <p className='text-sm'>
                      Already have an account?
                      <span
                        className='text-sm text-blue-600  cursor-pointer ml-1'
                        style={{ color: '#B6FFFA' }}
                        onClick={() => {
                          setLogin(true);
                          setPassword('');
                          setConfirmPassword('');
                          setUsername('');
                          setNotify('');
                        }}
                      >
                        Log In
                      </span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div >
    </>
  );
};
