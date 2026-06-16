# Medium Clone – Full-Stack Blogging Platform

A lightweight, serverless Medium-style blogging platform built with modern TypeScript tooling. This project features dynamic client-side caching, unified data validation via a shared Zod schema registry, and a highly responsive, clean user interface.

## 🚀 Tech Stack

### Frontend
* **React** (with TypeScript)
* **React Router DOM** (Client-side routing)
* **Axios** (Asynchronous HTTP requests)
* **Tailwind CSS** (Utility-first styling layout)

### Backend
* **Hono** (Ultrafast web framework for the edge)
* **Prisma ORM** (Database mapping & migrations)
* **PostgreSQL** / Connection Pooling
* **JWT (JSON Web Tokens)** (Session authentication)

### Shared Module
* **Zod** (Single source of truth for runtime validation schemas and type inferences)

---

## 📂 Project Architecture

```text
├── common/          # Shared Zod schemas & inferred TypeScript types (NPM registry module)
├── backend/         # Hono API instance running serverless edge database routing
└── frontend/        # React SPA dashboard tracking view content, creation, and edits
