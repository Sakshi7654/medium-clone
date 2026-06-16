import z from 'zod';

export const signupSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
    // .transform((val) => val.toLowerCase()), // Automatically normalizes to lowercase

  password: z
    .string({ error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password is too long" })
    // Security regex guarantees: 1 uppercase, 1 lowercase, 1 number, and 1 special char
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    // Prevents code injections or random symbols, allowing spaces and hyphens for real names
    .regex(/^[a-zA-Z\s\-']+$/, {
      message: "Name can only contain letters, spaces, hyphens, or apostrophes",
    }),
});
 
export const signinSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .trim()
    .min(1, { message: "Username cannot be empty" }),
    // .transform((val) => val.toLowerCase()), // Keeps normalization consistent with signup

  password: z
    .string({ error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

//type inference in zod... good for frontend to figure out the types
//but should be in another module-common


export const createBlogSchema=z.object({
  title:z.string().min(1,{message:"title is required"}).max(50,{message:"title is too long"}),
  content:z.string().min(1,{message:"content is required"}).max(500,{message:"content is too long"})
})


export const updateBlogSchema=z.object({
  title:z.string().min(1,{message:"title is required"}).max(50,{message:"title is too long"}),
  content:z.string().min(1,{message:"content is required"}).max(500,{message:"content is too long"})
})


export type SignupInput=z.infer<typeof signupSchema>
export type SigninInput = z.infer<typeof signinSchema>;
export type CreateBlogInput=z.infer<typeof createBlogSchema>
export type UpdateBlogSchema=z.infer<typeof updateBlogSchema>