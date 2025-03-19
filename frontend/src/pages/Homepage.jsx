import React from 'react'
import Navbar from '../components/Navbar'
import Main from '../components/Main'
import { Info } from "lucide-react";
import { FaTwitter, FaGithub } from "react-icons/fa";

const Homepage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <Navbar />
                <Main />
            </main>
            <footer className="border-t py-4 text-gray-500 text-sm flex justify-between items-center px-15 mt-5">
                <p>© 2025 Contest Notifier. All rights reserved.</p>

                <div className="flex items-center space-x-4">
                    <a href="https://linkedin.com/in/stalin67" className="flex items-center hover:text-gray-700">
                        <span className="mr-1">👤</span> Coded by Amit Yadav
                    </a>
                    <a href="https://twitter.com/stalin670" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-700">
                        <FaTwitter size={16} className="mr-1" /> @stalin670
                    </a>
                    <a href="https://github.com/stalin67" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-700">
                        <FaGithub size={16} className="mr-1" /> GitHub
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Homepage