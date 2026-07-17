import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export interface Blog {
    content: string;
    title: string;
    id: number; // Keep as number if your DB uses incremental IDs, change to string if using UUIDs
    author: {
        name: string;
    };
}

// 1. CREATE A GLOBAL CACHE STORAGE (Lives entirely outside the hook lifecycle)
const blogCache: Record<string, Blog> = {};

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | undefined>(undefined);

    useEffect(() => {
        // 2. CHECK THE CACHE FIRST: If we already have this blog, use it instantly!
        if (blogCache[id]) {
            setBlog(blogCache[id]);
            setLoading(false);
            return; // STOP HERE! Do not hit the backend URL
        }

        // 3. CACHE MISS: If we don't have it, go fetch it from the database URL
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            const fetchedBlog = response.data.blog || response.data;
            
            // 4. SAVE TO CACHE: Store it in our global object for next time
            blogCache[id] = fetchedBlog;
            
            setBlog(fetchedBlog);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    return { loading, blog,setBlog };
};

// 2. Bulk Blogs Fetching Hook with cursor based pagination
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]); // Starts safely as []
    const [loadingMore, setLoadingMore] = useState(false); // tracks append state
    const [nextCursor, setNextCursor] = useState<number | null>(null); // tracks pagination position
   
    // initial load - first page
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            // FIX: Fallback chaining guarantees a valid array is always assigned
            const dataReceived = response.data.blogs || response.data.posts || response.data;
            const cursorReceived = response.data.nextCursor;
            
            if (Array.isArray(dataReceived)) {
                setBlogs(dataReceived);
            } else if (dataReceived && Array.isArray(dataReceived.blogs)) {
                setBlogs(dataReceived.blogs);
            } else {
                console.error("Backend did not return an array layout:", response.data);
                setBlogs([]); // Fallback to safe array to prevent front-end maps from crashing
            }
            setNextCursor(cursorReceived !== undefined ? cursorReceived : null);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching bulk blogs:", err);
            setBlogs([]); // Keep UI stable on failure
            setLoading(false);
        });
    }, []);


    // Action Worker: Fetches the next page using the nextCursor token
    const fetchMoreBlogs = async () => {
        if (!nextCursor || loadingMore) return; // Prevent duplicate requests or final boundary breaches

        setLoadingMore(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk?cursor=${nextCursor}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            const dataReceived = response.data.blogs || response.data.posts || response.data;
            const cursorReceived = response.data.nextCursor;

            let newBlogs: Blog[] = [];
            if (Array.isArray(dataReceived)) {
                newBlogs = dataReceived;
            } else if (dataReceived && Array.isArray(dataReceived.blogs)) {
                newBlogs = dataReceived.blogs;
            }

            // Append the fresh posts directly to the existing blogs list array
            setBlogs(prev => [...prev, ...newBlogs]);
            setNextCursor(cursorReceived !== undefined ? cursorReceived : null);
        } catch (err) {
            console.error("Error fetching more paginated blogs:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    return {
        loading,
        loadingMore,   // ✅ Exposed to show small loading spinners on the load-more button
        blogs,
        nextCursor,    // ✅ Exposed to conditionally hide/show the button in the UI
        fetchMoreBlogs // ✅ Exposed trigger function for the UI button's onClick event
    };
};