import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
//not default jwt process, but hono has its own jwt process
import { decode, sign , verify } from 'hono/jwt'
import { signupSchema,signinSchema } from '@sakshi8624/common'


// 1. Explicitly define your Wrangler variables for TypeScript
type Bindings = {
  ACCELERATE_URL: string
  JWT_SECRET: string 
}

// 2. Pass the Bindings type to the Hono instance
export const userRouter = new Hono<{ Bindings: Bindings }>()

//context means whenever a req is coming, all things related to that req, like req,res, body,headers are stored in this context variable
// c is called context for a reason, contians all info abt req, res,env, passed to evry route handlerand middleware
// c can also be used as store, put more things in this context variable, like with set, get
userRouter.post('/signup',async (c) => {
  const body= await c.req.json();
  // body should be sanitize (zod)
  const { success }=signupSchema.safeParse(body);
  if(!success){
    c.status(400) 
    return c.json({
      msg: "inputs not correct"
    })
  }



  // need to add db url in prisma client to connect to db
  // 3. Use c.env to safely fetch the variable injected by Wrangler
  const prisma = new PrismaClient({
  accelerateUrl: c.env.ACCELERATE_URL,
}).$extends(withAccelerate()) //this means we are extending the prisma client with accelerate extension, which is necessary to use accelerate features like connection pooling, query caching, etc.
  
  //create user logic
  // no need for if !user... becasue of unique constarint and this try catch
  try{
    const user=await prisma.user.create({
      data:{
        username: body.username,
        password: body.password,
        name: body.name
      }
    })
    const jwt=await sign({
      id: user.id
    },c.env.JWT_SECRET)
    return c.json({
      message: "User signed up successfully!",
      jwt:jwt // cant be verified withour secret key but can be decoded
    }, 201)
  } catch(e){
    console.error("DATABASE ERROR:", e);
    c.status(500);
    return c.text('Database interaction failed or user already exists')
  }
})

userRouter.post('/signin', async(c) => {
  const body= await c.req.json();

  const { success }=signinSchema.safeParse(body);
  if(!success){
    c.status(400)
    return c.json({
      msg: "inputs not correct"
    })
  }
  const prisma = new PrismaClient({
  accelerateUrl: c.env.ACCELERATE_URL,
}).$extends(withAccelerate()) 
  try{
    const user=await prisma.user.findFirst({
      where:{
        username: body.username,
        password: body.password
      }
    })

    if(!user){
      c.status(401); // 403 is for forbidden access, which is more appropriate for authentication failure than 411 which is for length required
    return c.text('Invalid credentials')
    }
    const jwt=await sign({
      id: user.id
    },c.env.JWT_SECRET)
    return c.json({
      message: "User signed in successfully!",
      jwt:jwt // cant be verified withour secret key but can be decoded
    }, 201)
  } catch(e){
    console.error("DATABASE ERROR:", e);
    c.status(500); // 411 here because
    return c.text('Internal server error')
  }
})

//------------------------
//logout route