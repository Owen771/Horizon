# Horizon 

- A personal banking app come with a Dashboard

## Getting Started

First, you should configure the params in [.env.example](.env.example)

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech stack

- Next.js (React)
- Node.js (v18.17.0): runtime env for Next.js
- Typescript: type safety
- Tailwindcss: styling
- Eslint: ensure code quality
- Zod: TypeScript-first schema validation with static type inference (one use case is form)
- Shadcn ui: Component library, [import Components](components/ui)
- Appwrite: use as Database
  - but also it supports Authentication, Functions, Storage, and Messaging to your projects using the frameworks and languages of your choice.
- Dwolla: provides clients with a connection to the ACH Network by its own real-time payments network
- Sentry: error tracking and performance monitoring platform

## Setup

```bash
# init next.js & shadcn ui
npx create-next-app@latest ./ --typescript --tailwind --eslint
npx shadcn-ui@latest init
```

