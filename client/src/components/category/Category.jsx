import { useEffect, useState } from 'react';
import { SideBar } from '../Sidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Post } from '../post/Post';

const Category = ({ setModal, isLoggedIn }) => {
    const [posts, setPosts] = useState([]);
    const { category } = useParams();

    useEffect(() => {
        fetchData();
    }, [category]);

    const fetchData = async () => {
        const res = await axios.get(
            `http://localhost:8000/sub/${category}`,
        );
        setPosts(res.data);
    };
    return (
        <div>
            <SideBar />
            <div className='pt-20 lg:ml-56 bg-[#191A21] min-h-screen '>
                <h1 className='md:w-[650px] md:mx-auto mb-4 text-2xl font-semibold  text-[#f6f7f9]'>
                    {category}
                </h1>
                {posts.map((post) => (
                    <Post
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
export default Category;
