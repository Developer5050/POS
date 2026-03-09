"use client";

import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {

    const router = useRouter(); 

    const handleGoHome = () => {
        router.push("/");
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Not Found</h1>
            <p className="text-sm text-gray-500">The page you are looking for does not exist.</p>
            <button onClick={handleGoHome} className= "bg-[#27AA83] text-white p-2 rounded-md">Go to Home</button>
        </div>
    );
};

export default NotFoundPage;