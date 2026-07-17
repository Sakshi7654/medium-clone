import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useBlog } from "../hooks";
import { Appbar } from "../components/Appbar";

export const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, blog } = useBlog({ id: id || "" });
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Sync input states once the database payload finishes loading
    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setDescription(blog.content);
        }
    }, [blog]);

    const handleUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            alert("Title and content cannot be blank.");
            return;
        }
        
        setSubmitting(true);
        try {
            await axios.put(`${BACKEND_URL}/api/v1/blog`, {
                id,
                title,
                content: description
            }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            
            // Redirect back to single-view post frame
            navigate(`/blog/${id}`);
        } catch (e) {
            alert("Failed to update post. Make sure you are the author.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Appbar />
                <div className="flex justify-center pt-32 text-slate-400">Loading editor workspace...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Appbar />
            <div className="max-w-screen-md mx-auto px-4 pt-16 pb-24"> 
                
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">Editing Mode</div>

                {/* Title Input */}
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                    type="text" 
                    className="w-full text-4xl font-serif font-bold text-gray-900 placeholder-gray-300 focus:outline-none mb-6 tracking-tight" 
                    placeholder="Title" 
                />

                {/* Content Editor Component Area */}
                <TextEditor value={description} onChange={(e) => setDescription(e.target.value)} />
                
                {/* Control Action Tray */}
                <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                    <button 
                        onClick={handleUpdate} 
                        disabled={submitting}
                        type="button" 
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:bg-blue-400"
                    >
                        {submitting ? "Saving changes..." : "Save updates"}
                    </button>
                    <button 
                        onClick={() => navigate(`/blog/${id}`)} 
                        type="button" 
                        className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ value, onChange }: { value: string; onChange: (e: any) => void }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Optimized auto-resizing block without double-event conflicts
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Directly adjust height using the reactive value prop change
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }, [value]); // Triggers smoothly on state change, no manual listener required

    return (
        <div className="w-full mt-2">
            <textarea 
                ref={textareaRef}
                value={value}
                onChange={onChange} 
                className="w-full text-xl font-serif text-gray-800 placeholder-gray-300 bg-white border-0 focus:outline-none resize-none leading-relaxed tracking-wide" 
                placeholder="Tell your story..." 
                required 
            />
        </div>
    );
}