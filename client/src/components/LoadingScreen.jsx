import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    const phrases = [
        "Almost there...",
        "Patience is the Key to Knowledge...",
    ];

    // Pick a random phrase once per page load
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    return (
        <div className="flex items-center justify-center h-screen bg-[#23272F] text-[#f6f7f9]">
            <div className="text-center">
                {/* Spinning Logo */}
                <img
                    src="/knowledge-flow-high-resolution-logo.png"
                    alt="Loading..."
                    className="w-32 h-32 mx-auto animate-spin"
                />
                {/* Static Text */}
                <p className="mt-4 text-xl font-medium tracking-wide text-[#fcf4da]">
                    {randomPhrase}
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
