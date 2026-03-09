"use client";

import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Not Found</h1>
            <p className="text-sm text-gray-500">The page you are looking for does not exist.</p>
            <Link to="/" className="text-blue-500 hover:text-blue-700">Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;