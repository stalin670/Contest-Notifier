import React from 'react'
import Navbar from '../components/Navbar'
import Main from '../components/Main'
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Homepage = () => {
    return (
        <div className="flex flex-col min-h-screen dark:bg-black">
            <main className="flex-grow">
                <Navbar />
                <Main />
            </main>
            <footer className="border-t py-4 text-gray-500 text-sm flex justify-between items-center px-15 mt-5 dark:bg-black dark:text-white">
                <p>© 2025 Contest Notifier. All rights reserved.</p>

                <div className="flex items-center space-x-4">
                    <a href="https://linkedin.com/in/stalin67" className="flex items-center hover:text-gray-700 dark:hover:text-blue-500">
                        <span className="mr-1">< FaLinkedin /></span> Amit Yadav
                    </a>
                    <a href="https://twitter.com/stalin670" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-700 dark:hover:text-blue-500">
                        <FaTwitter size={16} className="mr-1" /> @stalin670
                    </a>
                    <a href="https://github.com/stalin67" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-700 dark:hover:text-blue-500">
                        <FaGithub size={16} className="mr-1" /> GitHub
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Homepage