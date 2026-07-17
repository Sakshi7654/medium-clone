import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign , verify } from 'hono/jwt'
import { updateBlogSchema, createBlogSchema } from '@sakshi8624/common';
// import DOMPurify from 'isomorphic-dompurify';
import { transform } from 'ultrahtml';
import sanitize from 'ultrahtml/transformers/sanitize';



type Bindings = {
  ACCELERATE_URL: string
  JWT_SECRET: string 
}
type Variables= {
    userId:string
}

export const blogRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

blogRouter.use("/*",async (c,next)=>{
    const authHeader=c.req.header("Authorization");
    // if not checking if we got the authHeader or not, then verifying will throw an error as it will expect a string but may get undefined
    if(!authHeader){
        c.status(401);
        return c.text('Unauthorized') 
    }
    try{
        const user=await verify(authHeader, c.env.JWT_SECRET,'HS256');
        //why again !user check is needed bcz token may be invalid or expired, then also verify will return null and we dont want that to go to route handler
        if(user){
            c.set("userId",user.id as string)
            await next()
        }else{
            c.status(401);
            return c.text('user not verified')
        }
        }
    catch(e){
        console.error(e);
        c.status(500);
        return c.text('Internal Server Error');
    }
    

})


blogRouter.post('/', async(c) => {
    const userId=c.get('userId') // middleware extracts the userid and pass it down to route handler
    const body= await c.req.json();

    // XSS Sanitization Boundary: Strip tags out completely
    const cleanTitle = body.title ? await transform(body.title, [sanitize({ dropElements: ['script', 'style'] })]) 
            : undefined;
        const cleanContent = body.content ?  await transform(body.content, [sanitize({ dropElements: ['script', 'style'] })]) 
            : undefined; 
    const prisma = new PrismaClient({
     accelerateUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate()) 

    const { success }=createBlogSchema.safeParse(body);
      if(!success){
        c.status(411)
        return c.json({
          msg: "inputs not correct"
        })
      }

    const post = await prisma.post.create({ 
		data: {
			title: cleanTitle,
			content: cleanContent,
			authorId: Number(userId)
		}
	});
	return c.json({
		id: post.id
	});


})

blogRouter.put('/', async (c) => {
    const userId=c.get('userId') 
    const prisma = new PrismaClient({
     accelerateUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate()) 

    try {
        const body = await c.req.json();

        const { success }=updateBlogSchema.safeParse(body);
        if(!success){
            c.status(411)
            return c.json({
            msg: "inputs not correct"
            })
        }
        const cleanTitle = body.title ? await transform(body.title, [sanitize({ dropElements: ['script', 'style'] })]) 
            : undefined;
        const cleanContent = body.content ?  await transform(body.content, [sanitize({ dropElements: ['script', 'style'] })]) 
            : undefined; 
        
        // CRITICAL: Added 'await' here
        const updatedPost = await prisma.post.update({
            where: {
                id: Number(body.id), 
                authorId: Number(userId) // ensure our db uses int for authorId, not String
            },
            data: {
                title: cleanTitle,
                content: cleanContent
            }
        });

        return c.json({ message: 'updated post', post: updatedPost });
    } catch (error) {
        console.error(error);
        //if post with that id not found
        c.status(404);
        return c.text('Post not found or unauthorized');
    }})

blogRouter.get('/bulk', async (c) => {
    // const body= await c.req.json();
    const prisma = new PrismaClient({
    accelerateUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate()) 

    // Parse optional query parameters: e.g., /api/v1/blog/bulk?cursor=5
    const cursorParam = c.req.query("cursor");
    const limit = 5; // Size boundary per payload frame

    try {
        const blogs = await prisma.post.findMany({
            take: limit + 1, // Fetch an extra record to peek if there's a next page
            ...(cursorParam ? { 
                skip: 1, // Skip the pivot post itself so it isn't duplicated
                cursor: { id: Number(cursorParam) } 
            } : {}),
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: { name: true }
                }
            },
            orderBy: {
                id: "desc" // Display the freshest blogs first
            }
        });

        // Determine if an additional data page exists downstream
        const hasNextPage = blogs.length > limit;
        
        // Trim the control check record if it exists
        const payload = hasNextPage ? blogs.slice(0, limit) : blogs;
        
        // Extract the target cursor pointer identifier for the next extraction loop
        const nextCursor = hasNextPage ? payload[payload.length - 1].id : null;

        return c.json({
            blogs: payload,
            nextCursor: nextCursor
        });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ error: "Failed to query serverless edge data." });
    }
})

blogRouter.get('/:id', async (c) => {
    const id=c.req.param('id')
    const prisma = new PrismaClient({ 
    accelerateUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate()) 
    // const body = await c.req.json(); // not body in get request

    try{
        const blog = await prisma.post.findFirst({
            where: {
                id:Number(id)
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
	   });
    //  Safety Check: Prisma returns 'null' if the ID doesn't exist (it doesn't throw an error)
        if (!blog) {
            c.status(404);
            return c.json({ msg: "Blog post not found" });
        }
	   return c.json(blog);

    }catch(e){
        console.error(e)
        c.status(500); // Server/Database connection issues
        return c.json({
            msg:"error while fetching the blog"
        })
    }
	

})
