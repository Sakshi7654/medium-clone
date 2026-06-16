import { Avatar } from "./BlogCard"
import { Link,useNavigate } from "react-router-dom"

export const Appbar = () => {
    const navigate=useNavigate();
    const handleLogout = () => {
        // 1. Clear the encryption session token out of browser memory
        localStorage.removeItem("token");
        
        // 2. Redirect the visitor immediately back to the authentication screen
        navigate("/signin");
    };
    return (
        <div className="border-b border-slate-100 flex justify-between px-10 py-4 items-center bg-white">
            <Link to={"/blog"} className="font-serif font-bold text-xl tracking-tight cursor-pointer text-gray-900">
                Medium
            </Link>
            
            <div className="flex items-center gap-6">
                {/* Publish Link Button */}
                <Link to={`/publish`}>
                    <button 
                        type="button" 
                        className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2 transition-all duration-150"
                    >
                        New Post
                    </button>
                </Link>

                {/* Clear Session / Logout Action Button */}
                <button
                    onClick={handleLogout}
                    type="button"
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors duration-150"
                >
                    Sign Out
                </button>

                {/* User Avatar */}
                <Avatar size={"big"} name="Sakshi" />
            </div>
        </div>
    );
};