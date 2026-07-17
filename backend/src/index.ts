import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
// import { PrismaClient } from "../generated/prisma/client";

import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

// 1. Explicitly define your Wrangler variables for TypeScript
type Bindings = {
  ACCELERATE_URL: string
  JWT_SECRET: string 
}
// 2. Pass the Bindings type to the Hono instance

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*',cors())

app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)



export default app
