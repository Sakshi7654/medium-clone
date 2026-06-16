import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { type ChangeEvent, useState, useRef, useEffect } from "react";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handlePublish = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title,
                content: description
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            navigate(`/blog/${response.data.id}`);
        } catch (e) {
            alert("Failed to publish post");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Appbar />
            {/* Main Wrapper matching Medium's clean, reading-optimized layout width */}
            <div className="max-w-screen-md mx-auto px-4 pt-16 pb-24"> 
                
                {/* Title Input - Borderless, Large, Focus-outline stripped */}
                <input 
                    onChange={(e) => setTitle(e.target.value)} 
                    type="text" 
                    className="w-full text-4xl font-serif font-bold text-gray-900 placeholder-gray-300 focus:outline-none mb-6 tracking-tight border-b border-transparent focus:border-gray-100 pb-2" 
                    placeholder="Title" 
                />

                {/* Subtitle / Content Editor area */}
                <TextEditor onChange={(e) => setDescription(e.target.value)} />
                
                {/* Publish Floating / Fixed Button */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    <button 
                        onClick={handlePublish} 
                        type="button" 
                        className="px-5 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-full transition-colors duration-150 ease-in-out shadow-sm"
                    >
                        Publish post
                    </button>
                </div>
            </div>
        </div>
    );
};

interface TextEditorProps {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextEditor({ onChange }: TextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Dynamic Height Calculation logic to prevent standard scrollbars
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        };

        textarea.addEventListener("input", adjustHeight);
        return () => textarea.removeEventListener("input", adjustHeight);
    }, []);

    return (
        <div className="w-full mt-2">
            <textarea 
                ref={textareaRef}
                onChange={onChange} 
                rows={4} 
                className="w-full text-xl font-serif text-gray-800 placeholder-gray-300 bg-white border-0 focus:outline-none resize-none leading-relaxed tracking-wide" 
                placeholder="Tell your story..." 
                required 
            />
        </div>
    );
}
// import { Appbar } from "../components/Appbar"
// import axios from "axios";
// import { BACKEND_URL } from "../../config";
// import { useNavigate } from "react-router-dom";
// import { type ChangeEvent, useState } from "react";

// export const Publish = () => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const navigate = useNavigate();

//     return <div>
//         <Appbar />
//         <div className="flex justify-center w-full pt-8"> 
//             <div className="max-w-screen-lg w-full">
//                 <input onChange={(e) => {
//                     setTitle(e.target.value)
//                 }} type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Title" />

//                 <TextEditor onChange={(e) => {
//                     setDescription(e.target.value)
//                 }} />
//                 <button onClick={async () => {
//                     const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
//                         title,
//                         content: description
//                     }, {
//                         headers: {
//                             Authorization: localStorage.getItem("token")
//                         }
//                     });
//                     navigate(`/blog/${response.data.id}`)
//                 }} type="submit" className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
//                     Publish post
//                 </button>
//             </div>
//         </div>
//     </div>
// }


// function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
//     return <div className="mt-2">
//         <div className="w-full mb-4 ">
//             <div className="flex items-center justify-between border">
//             <div className="my-2 bg-white rounded-b-lg w-full">
//                 <label className="sr-only">Publish post</label>
//                 <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
//             </div>
//         </div>
//        </div>
//     </div>
    
// }