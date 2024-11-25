import React from 'react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    return (
        <div className="flex items-center space-between h-screen bg-[#191A21] text-[#f6f7f9] px-6" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <img src="/knowledge-flow-high-resolution-logo.png" alt="Forum Logo" className="w-[80%] h-auto mx-auto" />
                </motion.div>
            </div>
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                    <h1 className="text-5xl font-extrabold mb-4 text-[#B6FFFA] tracking-wide drop-shadow-lg">
                        Welcome to the Student Forum for NITC
                    </h1>
                    <p className="max-w-md text-2xl font-medium text-[#fcf4da] leading-relaxed drop-shadow-sm">
                        Our student-run hub for sharing, connecting, and collaborating. Explore departments, join course discussions, and share knowledge with peers. Join us to build a vibrant community of learners!
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
