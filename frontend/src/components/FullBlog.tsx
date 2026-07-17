import { type Blog } from "../hooks/index"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"
import { useMemo } from "react";
import { Link } from "react-router-dom";

const CATCHPHRASES = [
    "Crafted to command attention instantly and sustain engagement down to the very last line.",
    "Engineered to maximize reader conversion and retention through clear, impactful structural hierarchy.",
    "A compelling breakdown designed to seize attention and spark deep curiosity from the first sentence.",
    "Masterfully written to grip the audience with high-impact, value-driven insights.",
    "Hooks the reader immediately with an authoritative blend of precision and narrative flow."
];

export const FullBlog = ({ blog }: { blog: Blog }) => {
    // const formattedDate = useMemo(() => {
    //     // Fallback gracefully if backend cache returns null or empty string temporarily
    //     if (!blog.createdAt) return "Published recently";
        
    //     return `Posted on ${new Date(blog.createdAt).toLocaleDateString("en-GB", {
    //         day: "numeric",
    //         month: "long",
    //         year: "numeric"
    //     })}`;
    // }, [blog.createdAt]);

    // Pick a consistent catchphrase for this specific blog using its numeric ID
    const catchphrase = useMemo(() => {
        const index = Math.abs(blog.id) % CATCHPHRASES.length;
        return CATCHPHRASES[index];
    }, [blog.id]);
    return (
        <div className="min-h-screen bg-white">
            <Appbar />
            <div className="flex justify-center">
                {/* 12-Column Grid Container */}
                <div className="grid grid-cols-12 px-6 md:px-10 w-full max-w-screen-xl pt-12 gap-8">
                    
                    {/* Left Column Area (Spans 8 columns on desktop, full width on mobile) */}
                    <div className="col-span-12 md:col-span-8">
                        
                        {/* Control Tray Header Layout */}
                        <div className="flex justify-between items-start border-b border-slate-50 pb-6 mb-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                    {blog.title}
                                </h1>
                                <div className="text-slate-400 pt-3 text-sm font-medium">
                                    {/* Posted on 2nd December 2023 */}
                                </div>
                            </div>
                            
                            {/* Action Routing Link to trigger your Edit Post component context */}
                            <Link to={`/edit/${blog.id}`} className="flex-shrink-0 ml-4">
                                <button type="button" className="text-xs font-semibold border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 px-4 py-2 rounded-full transition-all bg-white shadow-sm hover:shadow">
                                    Edit Post
                                </button>
                            </Link>
                        </div>

                        {/* RESTORED: Article body section rendering formatting parameters cleanly */}
                        <article className="text-lg text-gray-800 font-serif leading-relaxed whitespace-pre-line pb-16">
                            {blog.content}
                        </article>
                    </div>
                    
                    {/* Right Column Area: Author Information Card (Spans 4 columns) */}
                    <div className="col-span-12 md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-8 h-fit">
                        <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">
                            Author
                        </div>
                        <div className="flex w-full items-start">
                            <div className="pr-4 flex flex-col justify-center pt-1">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500 text-sm leading-relaxed">
                                    "{catchphrase}"
                                </div>
                            </div>
                        </div>  
                    </div>
                    
                </div>
            </div>
        </div>
    );
};