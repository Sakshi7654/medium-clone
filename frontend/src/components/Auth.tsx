// import { type ChangeEvent, useState } from "react";
// // import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { type SignupInput } from '@sakshi8624/common'

// import axios from "axios";
// import { BACKEND_URL } from "../../config";


// // type SignupInput = {
// //     name?: string;
// //     username: string;
// //     password: string;
// // };

// // Define a clear interface mapping the structure of our expected Zod errors
// interface FieldErrors {
//     name?: string[];
//     username?: string[];
//     password?: string[];
// }

// //type so that this only can be used for signup and signin
// export const Auth = ({ type }: { type: "signup" | "signin" }) => {
//     const navigate = useNavigate();
//     const [postInputs, setPostInputs] = useState<SignupInput>({
//         name: "",
//         username: "",
//         password: ""
//     });

//     // Add state to hold field-specific error messages
//     const [errors, setErrors] = useState<FieldErrors>({});

//     async function sendRequest(e: React.FormEvent) {
//         e.preventDefault(); // Prevents the browser from reloading the page
//         setErrors({}); // Clear old error indicators on a new submission attempt
//         console.log("Sending payload to backend:", postInputs);
//         try {
//             const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs,
//                 // Ensure that Axios is explicitly formatting your data as JSON. Usually, Axios does this automatically when you pass an object, but you can force it by ensuring the headers are explicitly set
//                 {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//             // FIX: Destructure 'jwt' from response.data, or use response.data.jwt
//             const { jwt } = response.data; 

//             if (jwt) {
//                 localStorage.setItem("token", jwt); // Now saving the actual token string!
//                 navigate("/blog"); 
//             } else {
//                 console.error("Token not found in response payload:", response.data);
//             }
//             navigate("/blog"); 
//         } catch(e:any) {
//             // // This will print the actual text/JSON error message sent by your Hono backend
//             // if (e.response) {
//             //     console.log("Backend Error Data:", e.response.data);
//             //     alert(`Error: ${JSON.stringify(e.response.data)}`);
//             if (e.response && e.response.data && e.response.data.errors) {
//                 const zodErrors = e.response.data.errors;
                
//                 // 3. Map Zod's formatted structural validation array into our component state
//                 setErrors({
//                     name: zodErrors.name?._errors,
//                     username: zodErrors.username?._errors,
//                     password: zodErrors.password?._errors,
//                 });
//             } else {
//                 alert("An unexpected network error occurred.");
//             }
//         }
//     }
    
//     return (
//         <div className="h-screen flex justify-center flex-col">
//             <div className="flex justify-center">
//                 <div>
//                     <div className="px-10">
//                         <div className="text-3xl font-extrabold">
//                             {type === "signup" ? "Create an account" : "Sign in to account"}
//                         </div>
//                         <div className="text-slate-500">
//                             {type === "signin" ? "Don't have an account?" : "Already have an account?" }
//                             <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
//                                 {type === "signin" ? "Sign up" : "Sign in"}
//                             </Link>
//                         </div>
//                     </div>

//                     {/* FIX 1: Wrap inputs in a form and use onSubmit */}
//                     <form onSubmit={sendRequest} className="pt-8">
//                         {type === "signup" ? (
//                             <LabelledInput 
//                                 id="name_input" // Pass unique ID
//                                 label="Name" 
//                                 placeholder="Sakshi Gupta..." 
//                                 error={errors.name?.[0]} // Pass the first error string if it exists
//                                 onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })} 
//                             />
//                         ) : null}

//                         <LabelledInput 
//                             id="username_input" // Pass unique ID
//                             label="Username" 
//                             placeholder="sakshi@gmail.com" 
//                             error={errors.username?.[0]} // Pass the validation error down to the input
//                             onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })} 
//                         />

//                         <LabelledInput 
//                             id="password_input" // Pass unique ID
//                             label="Password" 
//                             type="password" 
//                             placeholder="123456" 
//                             error={errors.password?.[0]} // Pass the validation error down to the input
//                             onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })} 
//                         />

//                         {/* FIX 2: Change button type to "submit" */}
//                         <button 
//                             type="submit" 
//                             className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
//                         >
//                             {type === "signup" ? "Sign up" : "Sign in"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// interface LabelledInputType {
//     id: string; // Add ID here
//     label: string;
//     placeholder: string;
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     type?: string; 
//     error?: string; // 4. Add an optional error prop to display the notice text
// }

// function LabelledInput({ id, label, placeholder, onChange, type, error }: LabelledInputType) {
//     return (
//         <div className="mb-4">
//             <label htmlFor={id} className="block mb-1.5 text-sm text-slate-700 font-semibold">
//                 {label}
//             </label>
//             <input 
//                 onChange={onChange} 
//                 type={type || "text"} 
//                 id={id} 
//                 // 5. If an error exists, we add a clear crimson border style flag around the field box
//                 className={`border text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 transition-all ${
//                     error 
//                     ? "border-red-500 bg-red-50 text-red-900 focus:ring-red-200" 
//                     : "border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-100"
//                 }`} 
//                 placeholder={placeholder} 
//                 required 
//             />
//             {/* 6. Conditionally display the custom warning note directly underneath the element */}
//             {error && (
//                 <p className="mt-1.5 text-xs font-medium text-red-600">
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// }
import { type ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type SignupInput } from '@sakshi8624/common';
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface FieldErrors {
    name?: string[];
    username?: string[];
    password?: string[];
}

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState<FieldErrors>({});

    async function sendRequest(e: React.FormEvent) {
        e.preventDefault(); 
        setErrors({}); 
        console.log("Sending payload to backend:", postInputs);
        
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, 
                postInputs,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const { jwt } = response.data; 

            if (jwt) {
                localStorage.setItem("token", jwt); 
                navigate("/blog"); // FIX: Corrected target destination path
            } else {
                console.error("Token not found in response payload:", response.data);
                setErrors({ username: ["Authentication returned an empty token."] });
            }
        } catch(e: any) {
            if (e.response && e.response.data) {
                const data = e.response.data;
                
                // Case A: Backend returned structured Zod input format errors
                if (data.errors) {
                    setErrors({
                        name: data.errors.name?._errors,
                        username: data.errors.username?._errors,
                        password: data.errors.password?._errors,
                    });
                } 
                // Case B: Backend returned a 401 Unauthorized check failure (Wrong password/User absent)
                else if (data.error || data.msg) {
                    setErrors({
                        username: [data.error || data.msg || "Invalid credentials."]
                    });
                } else {
                    alert("Authentication rejected by server.");
                }
            } else {
                alert("An unexpected network error occurred.");
            }
        }
    }
    
    return (
        <div className="h-screen flex justify-center flex-col bg-slate-50">
            <div className="flex justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md mx-4">
                    <div className="px-10 text-center">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {type === "signup" ? "Create an account" : "Sign in to account"}
                        </div>
                        <div className="text-slate-500 mt-2 text-sm">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                            <Link className="pl-1.5 underline text-blue-600 hover:text-blue-700 font-medium" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={sendRequest} className="pt-6">
                        {type === "signup" ? (
                            <LabelledInput 
                                id="name_input"
                                label="Name" 
                                placeholder="Sakshi Gupta..." 
                                error={errors.name?.[0]} 
                                onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })} 
                            />
                        ) : null}

                        <LabelledInput 
                            id="username_input"
                            label="Username" 
                            placeholder="sakshi@gmail.com" 
                            error={errors.username?.[0]} 
                            onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })} 
                        />

                        <LabelledInput 
                            id="password_input"
                            label="Password" 
                            type="password" 
                            placeholder="••••••••" 
                            error={errors.password?.[0]} 
                            onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })} 
                        />

                        <button 
                            type="submit" 
                            className="mt-6 w-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-150"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

interface LabelledInputType {
    id: string; 
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string; 
    error?: string; 
}

function LabelledInput({ id, label, placeholder, onChange, type, error }: LabelledInputType) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block mb-1.5 text-sm text-slate-800 font-semibold">
                {label}
            </label>
            <input 
                onChange={onChange} 
                type={type || "text"} 
                id={id} 
                className={`border text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 transition-all duration-100 ${
                    error 
                    ? "border-red-500 bg-red-50 text-red-900 focus:ring-red-100 focus:border-red-500" 
                    : "border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-100"
                }`} 
                placeholder={placeholder} 
                required 
            />
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}