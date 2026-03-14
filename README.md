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
- [Project Status](#project-status)
- [Contributing](#contributing)
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

## Database

The application uses **Supabase Postgres** to store shared farm data.

The database tracks:

- farm membership
- bundle progress state
- active farm sessions

Supabase **Realtime channels** are used to broadcast farm progress updates to all connected players.

---

## Deployment

The production application is deployed on **Netlify** using a Vite build.

Supabase provides authentication, database storage, and realtime synchronization for shared farm progress.

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
