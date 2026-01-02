# Ordo - Premium Kanban Task Manager

Ordo is an **elite productivity application** designed to elevate your task management experience. Built with a modern, glassmorphic aesthetic and powered by Angular and Supabase, it offers seamless task organization through an intuitive Kanban-style workflow.

## ✨ Key Features

- **Dynamic Kanban Board**: Organize your work across three smart categories: **To Do**, **In Progress**, and **Done**.
- **Intuitive Drag-and-Drop**: Effortlessly move tasks between categories and reorder them within lists to prioritize your day.
- **Smart Prioritization**: Assign **High**, **Medium**, or **Low** priority levels to tasks with color-coded visual indicators.
- **Real-Time Synchronization**: Changes are instantly synced to the cloud via Supabase, ensuring your data is always up-to-date across all devices.
- **Secure Authentication**: Supports both **Google Sign-In** and **Email/Password** authentication, with robust Row Level Security (RLS) to keep your data private.
- **Premium Glassmorphic UI**: A stunning, semi-transparent interface with vibrant gradients and subtle micro-animations for a high-end feel.
- **Dark Mode Optimized**: Designed primarily for modern dark themes to reduce eye strain and look professional.

## 🛠️ Technology Stack

- **Frontend**: Angular v21, TypeScript
- **Styling**: Tailwind CSS + Custom CSS (Glassmorphism)
- **State Management**: Angular Signals (Fine-grained reactivity)
- **Backend/Database**: Supabase (PostgreSQL, Real-time)
- **Auth**: Supabase Auth (OAuth & JWT)
- **Deployment**: Vercel

## 🚀 Deployment

### Vercel Deployment

This project is optimized for secure deployment on Vercel using a build-time environment injection strategy.

1.  **Environment Variables**: Add the following secrets to your Vercel project settings:
    - `ORD_SUPABASE_URL`
    - `ORD_SUPABASE_KEY`
2.  **Build Process**: The project uses a custom `prebuild` script to generate environment files dynamically, ensuring your secrets are never committed to version control.
3.  **Command**: The build command is `npm run build` and the output directory is `dist/ordo`.

### Local Development

1.  Create a `.env` file in the root with your Supabase credentials:
    ```bash
    SUPABASE_URL=your_url
    SUPABASE_KEY=your_key
    ```
2.  Run `npm run start` to launch the development server on `http://localhost:4201`.

## 🔒 Security

- **Environment Protection**: Secrets are managed via `.env` locally and environment variables in production, strictly ignored by Git.
- **Data Isolation**: Row Level Security (RLS) policies are active on the database to ensure users can only ever access their own data.
