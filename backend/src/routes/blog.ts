import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign , verify } from 'hono/jwt'
import { updateBlogSchema, createBlogSchema } from '@sakshi8624/common';



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
			title: body.title,
			content: body.content,
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
        
        // CRITICAL: Added 'await' here
        const updatedPost = await prisma.post.update({
            where: {
                id: body.id,
                authorId: Number(userId) // ensure our db uses int for authorId, not String
            },
            data: {
                title: body.title,
                content: body.content
            }
        });

        return c.json({ message: 'updated post', post: updatedPost });
    } catch (error) {
        console.error(error);
        //if post with that id not found
        c.status(404);
        return c.text('Post not found or unauthorized');
    }})

// /---------------------------//
// pagination
blogRouter.get('/bulk', async (c) => {
    // const body= await c.req.json();
    const prisma = new PrismaClient({
    accelerateUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate()) 

    const blogs= await prisma.post.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });
    return c.json(blogs);
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
