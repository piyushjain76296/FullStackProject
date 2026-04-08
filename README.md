# NexPost - Full-Stack Realtime Application

A production-grade, highly scalable full-stack web application built for seamless data synchronization and real-time search capabilities. This project demonstrates modular backend architecture and a highly dynamic, premium frontend UI.

##  Tech Stack

### Backend
- **Node.js + Express**: Scalable web framework.
- **MongoDB (Mongoose)**: NoSQL Database. *Fallbacks to an in-memory database automatically if not configured!*
- **Socket.io**: Real-time bidirectional event-driven communication.
- **Zod**: Declarative schema validation.
- **Winston & Morgan**: Professional production-ready logging.
- **In-Memory Cache**: Custom LRU Cache for optimized GET requests.

### Frontend
- **React (Vite)**: Lightning-fast build tooling and modern frontend ecosystem.
- **Vanilla CSS (Variables + Glassmorphism)**: Premium, performant styling strictly leveraging core CSS standards (Zero framework dependencies).
- **Socket.io-client**: Connected to the real-time search backend.
- **Axios**: Efficient API handling.
- **Lucide React**: Modern iconography.

##  Features

1. **Automated Sync**: Securely syncs and deduplicates 100+ posts from a mock External API (`jsonplaceholder`) into MongoDB.
2. **Real-time Search**: Instantaneous search feedback powered by WebSockets, with debouncing applied to prevent flooding. Fully utilizes MongoDB Text Indexes.
3. **Paginated Feed**: Retrieve standard, sorted, and naturally paginated post data.
4. **Caching Layer**: Basic LRU caching prevents the server from querying the DB redundantly during high load for equivalent queries.
5. **Modern Architecture**: Clean separation of concerns (MVC approach) with specific layers for Validation, Errors, and Services.

##  Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (optional, an in-memory version falls back if a URI isn't provided)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Run the Application
You can run both concurrently, or in separate terminal windows:

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The app will be accessible at `http://localhost:5173` (or the port defined by Vite output). Make sure to click **Sync from External API** first!

##  Deployment Strategy

To deploy this application successfully while maintaining the WebSocket persistence:

1. **Backend (Render / Railway / Heroku)**
   - Vercel Serverless Functions do not gracefully support persistent WebSockets (`socket.io`).
   - We recommend deploying the Node.js backend to a standard PaaS like Render. 
   - Expose the explicit domain via the `CORS_ORIGIN` environment variable.

2. **Frontend (Vercel)**
   - Standard Vite build process (`npm run build`).
   - Publish to Vercel.
   - Point the `VITE_API_URL` environment variable to the production backend URL.

##  Application Architecture Document

- `backend/src/middlewares/validate.js`: Generic HOF to apply Zod Schema validation dynamically.
- `backend/src/services/post.service.js`: The "brain" – handles business logic, MongoDB queries, aggregation, and DB deduplication (via `.bulkWrite` & `upsert`).
- `backend/src/socket/index.js`: Instantiates event listeners securely outside the Express main router.
- `frontend/src/hooks/useDebounce.js`: Hook intercepting overly repetitive key-strokes to prevent API floods.
- `frontend/src/hooks/useSocket.js`: Safely connects and caches the Socket lifecycle for React's strict lifecycle execution.

##  API Endpoints

- `GET /posts` → Get all posts (paginated or infinite scroll)
- `GET /posts/:id` → Get single post
- `POST /sync` → Fetch & store posts from external API securely without deduplication errors

 Check out the interactive Swagger API documentation at `/api-docs` when running the backend!

##  Demo Flow

1. Click **Sync from External API** to seed the initial data intelligently.
2. View the cleanly **paginated / lazy-loaded feed**.
3. Toggle the **Light/Dark mode** for instant layout changes.
4. Use the **real-time search bar** (using WebSocket indices).
5. Admire the instantaneous search, real-time typing indicators, and **keyword highlighting** in the cards!
