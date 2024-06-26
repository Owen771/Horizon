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
- Zod: TypeScript-first schema validation with static type inference. One of use case is form
- Shadcn ui: A Component library. [Imported Components](components/ui)
- Appwrite: use as Authentication & Database
  - It also supports Functions, Storage, and Messaging to your projects using the frameworks and languages of your choice.
- Dwolla: payment processor we uses to transfer fund. One use case is it provides a connection to the ACH Network by its own real-time payments network.
- Sentry: error tracking and performance monitoring platform
- Plaid: Allow app like this one to connect bank accounts securely

## Setup

```bash
# init next.js & shadcn ui
npx create-next-app@latest ./ --typescript --tailwind --eslint
npx shadcn-ui@latest init
```

