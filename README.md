# Stardew Co-Op Companion

![Vue](https://img.shields.io/badge/Vue-3-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646cff)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)
![Status](https://img.shields.io/badge/status-beta-orange)

A collaborative web companion for **Stardew Valley co-op farms** that lets players track **Community Center bundle progress together in real time**.

Players can join a shared farm, update bundle progress, and see changes instantly synchronized across all connected players.

This project was created as a simple companion tool for Stardew Valley players who want an easy way to track Community Center progress while playing co-op.

**Live Demo**  
https://stardewvalleycompanion.andrewberry.me

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [License](#license)

---

## Features

- Real-time Community Center bundle tracking for co-op farms
- Join shared farms using a simple farm code
- Live synchronization of bundle progress using Supabase Realtime
- Multiple tracker views:
  - Bundle view
  - Room view
  - Seasonal item view
- Import and export farm progress using shareable state codes
- Lightweight inventory tracking to see which bundle items you already have

---

## Tech Stack

### Frontend

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS

### Backend

- Supabase (Auth, Postgres, Realtime)

### Tooling

- ESLint
- Prettier
- Oxlint

---

## How It Works

Each farm maintains a **shared progress state stored in the database**.

Clients connect to the farm through a **Supabase Realtime channel**, allowing bundle progress to synchronize instantly across all players connected to the farm.

Progress can also be **exported and imported using state codes**, allowing farms to back up or share their Community Center progress.

---

## Local Development

This project can be run locally or self-hosted.

Because the app uses **Supabase for authentication and realtime synchronization**, you will need to create your own Supabase project.

### Prerequisites

Node.js

Required version:

```sh
^20.19.0 || >=22.12.0
```

A Supabase account  
https://supabase.com

### Clone the Repository

```sh
git clone https://github.com/andberry89/stardew-coop-companion.git
cd stardew-coop-companion
```

### Install Dependencies

```sh
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```sh
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values can be found in your Supabase project under:

Project Settings → API

---

### Run the Development Server

```sh
npm run dev
```

The app will start on the default Vite development port.

---

## Available Scripts

### Development

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

### Preview production build

```sh
npm run preview
```

### Run TypeScript type check

```sh
npm run type-check
```

### Run linters

```sh
npm run lint
```

### Format source files

```sh
npm run format
```

---

## Database

The project relies on a **Supabase Postgres schema** with several tables and RPC functions used for:

- farm membership
- session tracking
- bundle progress state synchronization

The schema is managed directly in Supabase and can be created through the **Supabase SQL editor**.

---

## Deployment

This project is designed to deploy easily on static hosting platforms such as **Netlify** or **Vercel**.

### Build Settings

Build command:

```sh
npm run build
```

Publish directory:

```sh
dist
```

Required environment variables:

```sh
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

For **Netlify deployments using Vue Router history mode**, add a redirect rule:

```txt
/*    /index.html   200
```

---

## Project Status

This project is currently **in beta**.

Features and database schema may evolve as development continues.

Bug reports and feedback are welcome.

---

## Contributing

This project is primarily a personal side project, but feedback and suggestions are welcome.

If you encounter a bug or have an idea for improvement, feel free to open an issue.

---

## License

Private project.  
Not currently licensed for redistribution.
