import { Navbar } from './components/navbar/Navbar';
import { LandingPage } from './components/LandingPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useRef, lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/LoadingScreen';
// import { EditComment } from './components/comment/EditComment';

const SavedPosts = lazy(() => import('./components/post/SavedPosts'));
const RelatedPost = lazy(() => import('./components/post/RelatedPost'));
const SearchedPost = lazy(() => import('./components/post/SearchedPost'));
const SubmittedPosts = lazy(() => import('./components/post/SubmittedPosts'));
const CreateSubcategory = lazy(() =>
  import('./components/category/CreateSubcategory'),
);
const CreateCategory = lazy(() =>
  import('./components/category/CreateCategory'),
);
const CreatePost = lazy(() => import('./components/post/CreatePost'));
const HomePage = lazy(() => import('./components/HomePage'));
const Subcategory = lazy(() => import('./components/category/Subcategory'));
// const Category = lazy(() =>
//   import('./components/category/Category'),
// );

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [focusOne, setFocusOne] = useState(false);
  const [sort, setSort] = useState('');
  const refOne = useRef(null);

  // Simulate fetching authentication status
  useEffect(() => {
    const fetchAuthState = async () => {
      const authState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(authState);
      setLoading(false); // Once loaded, stop the loading state
    };
    fetchAuthState();
  }, []);

  const handleCloseSearch = (e) => {
    //If user click outside the input
    if (!refOne.current.contains(e.target)) {
      setFocusOne(false);
    } else if (focusOne) {
      setFocusOne(false);
    } else {
      setFocusOne(true);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div onClick={handleCloseSearch} className='bg-[#23272F] h-screen '>
        <Toaster />
        <Navbar
          focusOne={focusOne}
          refOne={refOne}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          modal={modal}
          setModal={setModal}
        />
        <Suspense fallback={<h1>Loading Components...</h1>}>
          {isLoggedIn ? (

            <Routes>
              <Route
                path='/'
                element={
                  <HomePage
                    isLoggedIn={isLoggedIn}
                    modal={modal}
                    setModal={setModal}
                    sort={sort}
                    setSort={setSort}
                  />
                }
              />
              <Route path='/createPost' element={<CreatePost />} />
              <Route path='/createSubcategory' element={<CreateSubcategory />} />
              <Route path='/createCategory' element={<CreateCategory />} />
              <Route
                path='/savedPosts'
                element={
                  <SavedPosts setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
              <Route
                path='/submittedPosts'
                element={
                  <SubmittedPosts setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
              <Route
                path='/:subcategory'
                element={
                  <Subcategory setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
              <Route
                path='/posts/:sortType'
                element={
                  <HomePage
                    isLoggedIn={isLoggedIn}
                    modal={modal}
                    setModal={setModal}
                    sort={sort}
                    setSort={setSort}
                  />
                }
              />

              <Route
                path='/:subcategory/:postId'
                element={
                  <RelatedPost setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
              <Route
                path='/search/:query'
                element={
                  <SearchedPost setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
              <Route
                path='/sort'
                element={
                  <SearchedPost setModal={setModal} isLoggedIn={isLoggedIn} />
                }
              />
            </Routes>
          ) ://Rendered when user is not logged in
            (
              <Routes>
                <Route path="/" element={<LandingPage />} />
              </Routes>
            )}
        </Suspense>
      </div>
    </BrowserRouter >
  );
}

export default App;

