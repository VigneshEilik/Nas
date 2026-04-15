# Nas Academy Clone MVP

## Quick Start (Recommended)

### 1) Start PostgreSQL

```bash
docker compose up -d
```

### 2) Backend setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
node src/index.js
```

Backend runs on `http://localhost:5000`.

### 3) Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Demo Accounts

- Creator: `creator@nasclone.dev` / `Password@123`
- Student: `student@nasclone.dev` / `Password@123`

## Stop and Cleanup

- Stop DB: `docker compose stop`
- Stop and remove DB container: `docker compose down`
- Remove DB volume too (fresh reset): `docker compose down -v`
